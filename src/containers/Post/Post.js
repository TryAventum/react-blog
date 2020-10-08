import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import classes from './Post.module.css'

export default function Post({ user }) {
  let { id } = useParams()
  const [post, setPost] = useState()
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentlyUpdatingComment, setCurrentlyUpdatingComment] = useState(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [comments, setComments] = useState([])
  const [featuredImage, setFeaturedImage] = useState()

  const saveComment = async (event) => {
    event.preventDefault()

    if (isUpdate) {
      const response = await fetch(
        `http://localhost:3030/comments/${currentlyUpdatingComment.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('x-access-token'),
          },
          body: JSON.stringify({
            subject,
            body,
            post: id,
          }),
        }
      )

      let data = await response.json()
      setComments((oldComments) =>
        oldComments.map((c) => {
          if (c.id == currentlyUpdatingComment.id) {
            return data.content
          }
          return c
        })
      )
    } else {
      const response = await fetch('http://localhost:3030/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('x-access-token'),
        },
        body: JSON.stringify({
          subject,
          body,
          post: id,
        }),
      })

      let data = await response.json()
      setComments((oldComments) => [data, ...oldComments])
    }
  }

  const setUpdateData = (_id) => {
    const comment = comments.find((c) => c.id == _id)
    setSubject(comment.subject)
    setBody(comment.body)
    setIsUpdate(true)
    setCurrentlyUpdatingComment(comment)
  }

  const cancelUpdate = () => {
    setSubject('')
    setBody('')
    setIsUpdate(false)
    setCurrentlyUpdatingComment(null)
  }

  const deleteComment = async (_id) => {
    const response = await fetch(`http://localhost:3030/comments/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('x-access-token'),
      }
    })

    if (response.status === 200) {
      setComments((oldComments) => oldComments.filter((c) => c.id !== _id))
    }
  }

  //Fetch post's comments
  async function getPostComments(_postId) {
    let query = { where: { post: _postId } }

    const response = await fetch(
      `http://localhost:3030/comments?query=${encodeURIComponent(
        JSON.stringify(query)
      )}&page=1`
    )
    let data = await response.json()
    setComments(data.contents)
  }

  async function getUpload(_id) {
    const response = await fetch(`http://localhost:3030/uploads/${_id}`)

    let data = await response.json()
    setFeaturedImage(data)
  }

  //Fetch the post
  const getPost = useCallback(async (_id) => {
    const response = await fetch(`http://localhost:3030/posts/${_id}`)
    let data = await response.json()
    setPost(data)
    getUpload(data.content.featuredImage)
  }, [])

  useEffect(() => {
    getPost(id)
    getPostComments(id)
  }, [getPost, id])

  return (
    <>
      <div className={classes.postWrapper}>
        {featuredImage && (
          <img src={featuredImage.path} alt={featuredImage.originalName} />
        )}
        {post && (
          <div>
            <h2>{post.content.title}</h2>
            <p>{post.content.body}</p>
          </div>
        )}
      </div>
      {user && (
        <form onSubmit={saveComment}>
          <div>
            <label htmlFor="subject">Subject: </label>
            <input
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
              type="text"
              name="subject"
              id="subject"
              required
            />
          </div>
          <div>
            <label htmlFor="body">Body: </label>
            <textarea
              onChange={(e) => setBody(e.target.value)}
              value={body}
              id="body"
              name="body"
              rows="4"
              cols="50"
            />
          </div>
          <div>
            {!isUpdate && <input type="submit" value="Publish!" />}
            {isUpdate && <input type="submit" value="Update!" />}
            {isUpdate && (
              <input
                onClick={cancelUpdate}
                type="button"
                value="Cancel Update!"
              />
            )}
          </div>
        </form>
      )}
      {comments.length ? (
        <div>
          <h2>Comments:</h2>
          {comments.map((c) => {
            return (
              <div key={c.id}>
                <h3>{c.subject}</h3>
                <p>{c.body}</p>
                <div>
                  <button className={classes.editLink} onClick={() => setUpdateData(c.id)}>Update</button>/
                  <button className={classes.deleteLink} onClick={() => deleteComment(c.id)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
