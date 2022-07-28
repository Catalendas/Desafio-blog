import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import  Head  from 'next/head';
import Link from 'next/link'
import { RichText } from 'prismic-dom';
import { ReactElement, useState } from 'react';
import {FiCalendar, FiUser} from 'react-icons/fi'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
    readTime: number;
    content: {
      heading: string;
      body: {
        text: string
      }[];
    }[];
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps): ReactElement {

  const formatedPost = postsPagination.results.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      )
   
  }))

  const [posts, setPosts] = useState<Post[]>(formatedPost)

  return(
    <>
     <Head>
        <title>Home | spacetraveling </title>
     </Head>

      <main className={commonStyles.container}>
        
        
        <div className={styles.postList}>
          
           {posts.map(post => (
             <Link href={`/post/${post.uid}`} key={post.uid}>   
             <a>
               <strong>{post.data.title}</strong>
               <p>{post.data.subtitle}</p>
               <ul>
                 <li><FiCalendar/>{post.first_publication_date}</li>
                 <li><FiUser/>{post.data.author}</li>
               </ul>
             </a>                     
           </Link>
           ))}

           

          <button type='button'>Carregar mais posts</button>
        </div>

      </main>
    </>
  )
}

 export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("post", {
    pageSize: 1,
    orderings: {
      field: 'last_publication_date',
      direction: 'desc',
    }
  });
  

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        substitle: post.data.subtitle,
        author:post.data.author
      }
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  }

  return {
    props: {
      postsPagination,
      posts
    },
    revalidate: 1800,
  }

 }
