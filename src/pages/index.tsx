import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import  Head  from 'next/head';
import Link from 'next/link'

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

  const formatedPost = postsPagination.results.map(post => {
    return {
        ...post,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        )
    }
  })

  
  const [posts, setPosts] = useState<Post[]>(formatedPost)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  const [currentPage, setCurrentPage] = useState(1)

  async function handleNextPage(): Promise<void>{
    if(currentPage != 1 && nextPage == null) {
      return
    }

    const postsResults = await fetch(`${nextPage}`).then(response => 
      response.json()
    )

    setNextPage(postsResults.next_page)
    setCurrentPage(postsResults.page)

    const newPosts = postsResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date:format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author:post.data.author
        }
      }
    })

    setPosts([...posts, ...newPosts])
  }

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

         {nextPage && (
           <button type='button' onClick={handleNextPage}>Carregar mais posts</button>
         )}
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
        subtitle: post.data.subtitle,
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
