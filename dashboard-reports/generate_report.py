#!/usr/bin/env python3
"""
Parse Playwright JSON report and generate data for the E2E test report dashboard.
All written files stay in this directory:
  report_data.json, run_history.json, index.html
Usage: python generate_report.py [path/to/results.json]
Default: project root test-results/results.json
"""

import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime


def ms_to_hhmmss(ms):
    """Convert milliseconds to HH:MM:SS."""
    try:
        total_secs = int(ms) // 1000
        m, s = divmod(total_secs, 60)
        h, m = divmod(m, 60)
        return f"{h:02d}:{m:02d}:{s:02d}"
    except (ValueError, TypeError):
        return "00:00:00"


def extract_tests(suites, parent_suite=""):
    """Recursively extract tests from Playwright JSON suites."""
    tests = []
    for suite in suites:
        suite_title = suite.get("title", "")
        suite_file = suite.get("file", "")
        # Build a human-friendly suite name from directory structure
        # e.g. "dashboard-tests/login.spec.ts" -> "Dashboard Tests"
        if suite_file and not parent_suite:
            parts = Path(suite_file).parts
            # Use the folder name as suite name (e.g. "dashboard-tests" -> "Dashboard Tests")
            if len(parts) >= 2:
                folder = parts[-2]
                current_suite = folder.replace("-", " ").replace("_", " ").title()
            else:
                current_suite = suite_title or suite_file
        elif parent_suite:
            current_suite = parent_suite
        else:
            current_suite = suite_title or "Other"

        # Process specs (test definitions)
        for spec in suite.get("specs", []):
            spec_title = spec.get("title", "")
            tags = spec.get("tags", [])
            # Each spec can have multiple tests (one per project/browser)
            for test_entry in spec.get("tests", []):
                project = test_entry.get("projectName", "")
                expected_status = test_entry.get("expectedStatus", "passed")
                results = test_entry.get("results", [])
                # Use the last result (final retry)
                if results:
                    last_result = results[-1]
                    status = last_result.get("status", "passed")
                    duration_ms = last_result.get("duration", 0)
                    errors = last_result.get("errors", [])
                    start_time = last_result.get("startTime", "")
                    # Build step info from attachments and stdout
                    steps = extract_steps(last_result)
                    # Build log entries from stdout, stderr, and errors
                    logs = extract_logs(last_result)
                else:
                    status = "skipped"
                    duration_ms = 0
                    errors = []
                    start_time = ""
                    steps = []
                    logs = []

                # Normalize status to PASS/FAIL/SKIP
                if status == "passed":
                    normalized_status = "PASS"
                elif status == "failed" or status == "timedOut" or status == "interrupted":
                    normalized_status = "FAIL"
                elif status == "skipped":
                    normalized_status = "SKIP"
                else:
                    normalized_status = status.upper()

                elapsed_sec = round(duration_ms / 1000, 2)

                test_data = {
                    "name": spec_title,
                    "status": normalized_status,
                    "elapsed": elapsed_sec,
                    "suite": current_suite,
                    "tags": tags,
                    "steps": steps,
                    "logs": logs,
                }
                if project:
                    test_data["browser"] = project

                tests.append(test_data)

        # Recurse into nested suites
        if suite.get("suites"):
            tests.extend(extract_tests(suite["suites"], current_suite))

    return tests


def extract_steps(result):
    """Extract step info from a Playwright test result."""
    steps = []
    for step in result.get("steps", []):
        step_data = {
            "name": step.get("title", step.get("category", "")),
            "status": "PASS" if step.get("error") is None else "FAIL",
            "elapsed": round(step.get("duration", 0) / 1000, 2),
            "children": [],
        }
        # Recurse into nested steps
        for child in step.get("steps", []):
            child_data = {
                "name": child.get("title", child.get("category", "")),
                "status": "PASS" if child.get("error") is None else "FAIL",
                "elapsed": round(child.get("duration", 0) / 1000, 2),
                "children": [],
            }
            step_data["children"].append(child_data)
        steps.append(step_data)
    return steps


def extract_logs(result):
    """Extract log messages from a Playwright test result."""
    logs = []
    # stdout
    for entry in result.get("stdout", []):
        text = entry if isinstance(entry, str) else (entry.get("text", "") if isinstance(entry, dict) else str(entry))
        text = text.strip()
        if text:
            logs.append({"level": "INFO", "timestamp": "", "message": text})
    # stderr
    for entry in result.get("stderr", []):
        text = entry if isinstance(entry, str) else (entry.get("text", "") if isinstance(entry, dict) else str(entry))
        text = text.strip()
        if text:
            logs.append({"level": "WARN", "timestamp": "", "message": text})
    # errors
    for err in result.get("errors", []):
        msg = err.get("message", "") if isinstance(err, dict) else str(err)
        msg = msg.strip()
        if msg:
            logs.append({"level": "ERROR", "timestamp": "", "message": msg})
    return logs


def main():
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    # Determine input path
    if len(sys.argv) > 1:
        json_path = Path(sys.argv[1]).resolve()
    else:
        candidates = [
            project_root / "test-results" / "results.json",
        ]
        existing = [p.resolve() for p in candidates if p.exists()]
        if not existing:
            print("Error: No results.json found. Run Playwright tests first (npx playwright test).", file=sys.stderr)
            sys.exit(1)
        json_path = max(existing, key=lambda p: p.stat().st_mtime)
        print(f"Using: {json_path}")

    if not json_path.exists():
        print(f"Error: {json_path} not found. Run Playwright tests first.", file=sys.stderr)
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        pw_data = json.load(f)

    # Extract stats
    stats = pw_data.get("stats", {})
    start_time = stats.get("startTime", "")
    total_duration_ms = stats.get("duration", 0)
    expected_count = stats.get("expected", 0)
    unexpected_count = stats.get("unexpected", 0)
    flaky_count = stats.get("flaky", 0)
    skipped_count = stats.get("skipped", 0)

    # Parse generated time
    try:
        dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        generated = dt.isoformat()
        last_run = dt.strftime("%d-%b-%Y %I:%M %p")
    except Exception:
        generated = start_time
        last_run = start_time

    # Extract all tests from suites
    suites = pw_data.get("suites", [])
    all_tests = extract_tests(suites)

    # Calculate stats from tests
    total_pass = sum(1 for t in all_tests if t["status"] == "PASS")
    total_fail = sum(1 for t in all_tests if t["status"] == "FAIL")
    total_skip = sum(1 for t in all_tests if t["status"] == "SKIP")
    total_tests = total_pass + total_fail + total_skip
    success_rate = round((total_pass / total_tests * 100), 2) if total_tests else 0

    failures = [
        {"name": t["name"], "elapsed": t["elapsed"], "suite": t["suite"], "tags": t["tags"]}
        for t in all_tests if t["status"] == "FAIL"
    ]

    # Build by-suite stats
    suite_map = {}
    for t in all_tests:
        suite_name = t["suite"]
        if suite_name not in suite_map:
            suite_map[suite_name] = {"name": suite_name, "pass": 0, "fail": 0, "skip": 0}
        if t["status"] == "PASS":
            suite_map[suite_name]["pass"] += 1
        elif t["status"] == "FAIL":
            suite_map[suite_name]["fail"] += 1
        elif t["status"] == "SKIP":
            suite_map[suite_name]["skip"] += 1
    by_suite = list(suite_map.values())

    # Build by-tag stats
    tag_map = {}
    for t in all_tests:
        for tag in (t.get("tags") or []):
            if tag not in tag_map:
                tag_map[tag] = {"name": tag, "pass": 0, "fail": 0, "skip": 0}
            if t["status"] == "PASS":
                tag_map[tag]["pass"] += 1
            elif t["status"] == "FAIL":
                tag_map[tag]["fail"] += 1
            elif t["status"] == "SKIP":
                tag_map[tag]["skip"] += 1
    by_tag = list(tag_map.values())

    # Append current run to history (keep last 30)
    run_history_path = script_dir / "run_history.json"
    run_history = []
    if run_history_path.exists():
        try:
            run_history = json.loads(run_history_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            run_history = []
    if not isinstance(run_history, list):
        run_history = []
    current_run = {
        "lastRun": last_run,
        "pass": total_pass,
        "fail": total_fail,
        "skip": total_skip,
        "totalTests": total_tests,
        "successRate": round(success_rate, 2),
        "duration": ms_to_hhmmss(total_duration_ms),
    }
    run_history.append(current_run)
    run_history = run_history[-30:]
    run_history_path.write_text(json.dumps(run_history, indent=2), encoding="utf-8")

    report = {
        "generated": generated,
        "lastRun": last_run,
        "duration": ms_to_hhmmss(total_duration_ms),
        "totalTests": total_tests,
        "pass": total_pass,
        "fail": total_fail,
        "skip": total_skip,
        "successRate": round(success_rate, 2),
        "tests": all_tests,
        "failures": failures,
        "byTag": by_tag,
        "bySuite": by_suite,
        "framework": "Playwright",
        "testType": "E2E",
        "version": "1.0.0",
        "runHistory": run_history,
    }

    out_path = script_dir / "report_data.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Report data written to {out_path}")

    # Embed JSON into index.html
    index_path = script_dir / "index.html"
    if index_path.exists():
        html = index_path.read_text(encoding="utf-8")
        json_str = json.dumps(report).replace("</script>", "<\\/script>").replace("</SCRIPT>", "<\\/SCRIPT>")
        embed = f'<script>window.REPORT_DATA = {json_str};</script>'
        if "<!-- REPORT_DATA_PLACEHOLDER -->" in html:
            html = html.replace("<!-- REPORT_DATA_PLACEHOLDER -->", embed)
        else:
            html = re.sub(r"<script>window\.REPORT_DATA = [\s\S]*?</script>", lambda m: embed, html, count=1)

        engineer_name = os.environ.get("ENGINEERNAME", "Lotfi OTAI")
        dashboard_password = os.environ.get("DASHBOARDPASSWORD", "Naguez21102024")
        html = html.replace("__ENGINEER_NAME__", engineer_name)
        html = html.replace("__DASHBOARD_PASSWORD__", dashboard_password)

        index_path.write_text(html, encoding="utf-8")
        print(f"Dashboard updated: {index_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
