import { sql } from "@vercel/postgres";

export default async function Home() {
  let time = await fetch(
    "https://worldtimeapi.org/api/timezone/Europe/London",
    { next: { revalidate: 10 } }
  );
  const data = await time.json();
  const datetime = new Date(data.datetime);
  const evenEasierToReadDate = datetime.toLocaleTimeString("en-GB");
  console.log(data);

  await sql`INSERT INTO viewsTable (views) SELECT 0  WHERE NOT EXISTS (SELECT * FROM ViewsTable)`;
  await sql`UPDATE ViewsTable SET views = views + 1`;
  const result = await sql`SELECT views from ViewsTable`;

  console.log(result);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <p>This is my root route</p>
      <p>This has been viewed {result.rows[0].views} times</p>
      <p>The time is: {evenEasierToReadDate} </p>
    </main>
  );
}
