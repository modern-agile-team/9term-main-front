import nextJest from "next/jest";

const createJestConfig = nextJest({
  // next.config.js와 .env 파일이 있는 디렉토리를 지정
  dir: "./",
});

// Jest에 추가할 커스텀 설정
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

// createJestConfig는 next/jest가 제공하는 설정을 사용하도록 설정을 내보냅니다
export default createJestConfig(customJestConfig);
