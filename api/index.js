const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const url = require('url');


export default async function handler(req, res) {
  const queryObject = url.parse(req.url, true).query;

  if (queryObject.id) {
    const result = await prisma.email.upsert({
      create: { opens: 1 },
      update: { opens: { increment: 1 } },
      where: { id: parseInt(queryObject.id) },
    });
    let img = Buffer.from("iVBO…AAAYAAjCB0C8AAAAASUVORK5CYII=", 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  } else {
    const result = await prisma.email.findMany();
    console.log(result);
    if (result) {
      res.writeHeader(200, { "Content-Type": "text/html" });
      let html = "<ul>";
      result.forEach(item => {
        html += `<li>Email ${item.id} has ${item.opens} opens</li>`;
      });
      html += "</ul>";
      console.log(html);
      res.write(html);
      res.end();
    }
  }
}