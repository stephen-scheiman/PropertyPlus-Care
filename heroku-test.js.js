async function herokuServerTest() {
  const today = new Date();

  console.log('\ntoday', today);

  today.setHours(0, 0, 0, 0);
  console.log('\nsetHours all 0\n', today);

  today.setHours(-8, 0, 0, 0);
  console.log('\nsetHours -8\n', today);
}
herokuServerTest();