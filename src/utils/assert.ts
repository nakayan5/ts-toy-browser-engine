/**
 * conditionにfalseが入った場合、messageを表示してエラーを投げる
 * @param condition
 * @param message
 */
export const assert = (condition: boolean, message?: string): void => {
  if (condition) {
    throw new Error(message ?? 'Panic!');
  }
};
