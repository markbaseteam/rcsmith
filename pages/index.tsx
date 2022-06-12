import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";
import path from "path";
import recursive from "recursive-readdir";
import styles from "../assets/styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_PROJECT_NAME}</title>
        <meta
          name="description"
          content={
            process.env.NEXT_PUBLIC_PROJECT_NAME + " generated by Markbase"
          }
        />
        <link rel="icon" href="/favicon-512x512.png" />
      </Head>

      <main className={styles.main}>
        <div className="mb-4">
          {/* {props.content.map(({ slug }) => (
            <Link key={slug} href={`/pages/${slug}`} passHref>
              <a>
                <p className="text-lg text-white">{slug}</p>
              </a>
            </Link>
          ))} */}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  // Get home files from first level of the content dir
  let homeFiles = fs.readdirSync(path.join("content")).filter((filename) => {
    if (filename.includes(".md")) {
      const resolvedPath = "content/" + filename;

      try {
        const mdFile = fs.readFileSync(path.resolve(resolvedPath), "utf-8");
        const md = matter(mdFile, {});

        return md.data.hasOwnProperty("home") && md.data.home;
      } catch (error) {
        return false;
      }
    }
  });

  if (homeFiles.length > 0) {
    const resolvedPath =
      "/" + encodeURIComponent(homeFiles[0].replace(".md", ""));

    return {
      redirect: {
        destination: resolvedPath,
        permanent: true,
      },
    };
  } else {
    const files = await recursive(path.resolve("content"));
    for (const file of files) {
      if (file.endsWith(".md")) {
        let postPath = file.split(path.resolve(""))[1];
        let fileName = file.replace(/\\/g, "/").split("/")[
          file.replace(/\\/g, "/").split("/").length - 1
        ];

        postPath = postPath
          .replace(/\\/g, "/")
          .split("/")
          .map((p) => encodeURIComponent(p))
          .join("/");

        postPath = postPath.replace(/.md/g, "").replace("content/", "");

        if (postPath.startsWith("/") || postPath.startsWith("\\")) {
          postPath = postPath.substring(1);
        }

        return {
          redirect: {
            destination: postPath,
            permanent: true,
          },
        };
      }
    }
    // // Redirect to a random page
    // homeFiles = fs.readdirSync(path.join("content")).filter((filename) => {
    //   if (filename.includes(".md")) {
    //     return true;
    //   }
    // });
    // const resolvedPath =
    //   "/" + encodeURIComponent(homeFiles[0].replace(".md", ""));
  }
}

export default Home;
