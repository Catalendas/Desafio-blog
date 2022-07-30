import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps): JSX.Element {

  console.log(post.data)

  return (
    <>
      <Head>
          <title>Post |  spacetraveling </title>
      </Head>

      <img src="/images/calopsita-olhando.jpg" alt="imagen" className={styles.banner}/>
      <main className={commonStyles.container}>
          <div className={styles.post}>

            <div className={styles.postHeader}>
              <h1>Titulo</h1>

              <ul>
                <li><FiCalendar/>15 mar 2022</li>
                <li><FiUser/>Marcos alexandre</li>
                <li><FiClock/> 4 min</li>
              </ul>
            </div>
            
            {post.data.content.map(content => {
              return(
                <article key={content.heading}>

                  <h2>{content.heading}</h2>
                  <div 
                    className={styles.postContent}
                    dangerouslySetInnerHTML ={{
                      __html: RichText.asHtml(content.body)
                    }}
                  />    
                </article>
              )
            })}
          </div>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient({});
  // const posts = await prismic.getByType(TODO);

  return {
    paths: [],
    fallback: true
  }
};

 export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params
  const response = await prismic.getByUID('post', String(slug));

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body]
        }
      })
    },
  }

 return {
    props: {
      post
    }, 
    revalidate: 1800,
 }
};
