async function herokuServerTest() {
  const today = new Date();

  console.log('\ntoday', today);

  today.setUTCHours(today.getUTCHours() - 8);
  today.setUTCHours(0,0,0,0);
  console.log('\nsetHours -8\n', today);

}
herokuServerTest();