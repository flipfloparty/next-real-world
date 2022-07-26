import { ArticleViewFragment, CommentViewFragment, useDeleteCommentMutation } from '../../generated/graphql';
import { useCurrentUser } from '../../lib/hooks/use-current-user';
import { useErrorsHandler } from '../../lib/hooks/use-errors-handler';
import ArticleAuthorInfo, { AuthorInfo } from './ArticleAuthorInfo';

interface ArticleCommentProps {
  comment: CommentViewFragment;
  article: ArticleViewFragment;
}

export default function ArticleComment({ comment, article }: ArticleCommentProps) {
  const { user } = useCurrentUser();
  const { handleErrors } = useErrorsHandler();
  const { id, body, author, createdAt } = comment;
  const { username, image } = author;
  const authorInfo: AuthorInfo = { createdAt, username, image };

  const [deleteComment] = useDeleteCommentMutation({
    optimisticResponse: { deleteComment: { id, __typename: 'Comment' } },
    update(cache, { data }) {
      if (data) {
        const deleted = data.deleteComment;
        cache.modify({
          id: cache.identify(article),
          fields: {
            comments(existingCommentRefs = [], { readField }) {
              return existingCommentRefs.filter((commentRef: any) => deleted.id !== readField('id', commentRef));
            },
          },
        });
      }
    },
    onError: (err) => handleErrors(err),
  });
  async function onDeleteComment() {
    await deleteComment({ variables: { deleteCommentId: id } });
  }

  return (
    <li className='border rounded-sm shadow-sm mb-2'>
      <div className='p-4'>
        <p className=''>{body}</p>
      </div>
      <div className='bg-gray-100 py-2 px-4 border shadow-sm'>
        <div className='flex flex-wrap items-center justify-between mx-auto'>
          <ArticleAuthorInfo authorInfo={authorInfo} inlined />
          {user && user.username === username && (
            <span className='self-end'>
              <i
                className='ion-trash-a cursor-pointer'
                aria-label={`Delete comment #${id}`}
                onClick={() => onDeleteComment()}
              ></i>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
