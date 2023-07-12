const foo = () => {
  const a = [1, 2, 3]; // 스코프 내부 작성 시 두 공백 들여쓰기
  console.log("a is " + a);
};
// <= 빈 줄이 한 줄 이상 안됨.
foo();
