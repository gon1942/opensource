test("sample test", () => {
  expect(1 + 2 + 3).toBe(6);
});
describe("계산 테스트", () => {
  const a = 1,
    b = 2;

  test("a + b =  3.", () => {
    expect(a + b).toEqual(3);
  });
});
