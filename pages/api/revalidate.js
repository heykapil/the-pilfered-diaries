import crypto from "crypto";

/**
 * @type { import('next').NextApiHandler }
 * @param { import('next').NextApiRequest } req
 * @param { import('next').NextApiResponse } res
 */
export default async function handler(req, res) {
  // only works with post.
  if (req.method !== "POST")
    return res.status(405).json({
      error: "Method not supported",
    });

  // check password availability.
  const password = req.body.pwd;
  if (!password)
    return res.status(400).json({
      error: "Required fields not provided.",
    });

  const hash = crypto
    .pbkdf2Sync(password, process.env.SALT, 768, 64, "sha256")
    .toString("hex");

  // check password validity.
  if (hash !== process.env.PWD_HASH)
    return res.status(401).json({ error: "Invalid credentials." });

  // check if routes are provided.
  const { paths = [] } = req.body;
  if (paths.length === 0)
    return res.status(400).json({ error: "Routes not provided." });

  /* MAIN BUSINESS LOGIC */
  try {
    await Promise.all([
      res.revalidate("/"),
      ...paths.map((route) => res.revalidate(`/${route}`)),
    ]);
    return res.json({ message: `Rebuilt routes: ${paths.join(", ")}` });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong, revalidation of the routes failed.",
    });
  }
}
