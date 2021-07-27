import { NewsletterForm } from '../components/molecules/NewsletterForm';
import { SingleArticle } from '../components/organisms/SingleArticle';
import { TwoColumns } from '../components/templates/TwoColumns';
import { useRunningHeader } from '../hooks/runningHeader';
import { postToProps } from '../utils/postToProps';
import { getAllPermalinks, getPostByPermalink } from '../utils/wordpress';

import type { InferGetStaticPropsType } from '../types';
import type { GetStaticPaths, GetStaticPropsContext } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPermalinks();

  return {
    paths: posts.map((permalink) => {
      return {
        params: { permalink },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || typeof params.permalink !== 'string') {
    return { notFound: true };
  }

  const permalink = params.permalink;

  const post = await getPostByPermalink(permalink);

  if (!post) {
    return { notFound: true };
  }

  const authorsJson = (await import(/* webpackChunkName: "authors" */ '../authors.json')).default;
  return { props: postToProps(post, authorsJson) };
};

const PermalinkPage = ({ excerpt, content, frontmatter }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { setRunningHeader } = useRunningHeader();

  return (
    <TwoColumns withSidebar={true} pageKind="post">
      <SingleArticle
        ref={setRunningHeader}
        excerpt={excerpt}
        content={content}
        id={frontmatter.id}
        index={frontmatter.index}
        title={frontmatter.title}
        authors={frontmatter.authors}
        mainCategory={frontmatter.mainCategory}
        href={frontmatter.permalink}
        cover={frontmatter.cover}
      />
      <NewsletterForm />
    </TwoColumns>
  );
};
export default PermalinkPage;
