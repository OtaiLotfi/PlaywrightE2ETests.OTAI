module.exports = {
  reporter: ['lcov', 'text'],
  extension: ['.ts'],
  include: ['otaiE2ETests/**/*.ts'],
  exclude: ['**/*.spec.ts', '**/*.test.ts', '**/config.ts'],
  all: true,
  require: ['ts-node/register']
};