async function herokuServerTest() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('\nsetHours all 0\n', today);
}
herokuServerTest();