import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import classes from './Home.module.css'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [featuredImages, setFeaturedImages] = useState([])

  let queryString = new URLSearchParams(useLocation().search)
  const currentPage = Number(queryString.get('page')) || 1

  //Fetch the features images
  async function getUploadsInIds(ids) {
    let query = { whereIn: { column: 'id', values: ids } }

    const response = await fetch(
      `http://localhost:3030/uploads/all?query=${encodeURIComponent(
        JSON.stringify(query)
      )}`
    )
    let data = await response.json()

    setFeaturedImages(data.uploads)
  }

  //Fetch the posts
  const getPosts = useCallback(async (_p) => {
    const response = await fetch(`http://localhost:3030/posts?page=${_p}`)
    let data = await response.json()
    const allFeaturedImagesIds = data.contents.map((p) => p.featuredImage)
    setPosts(data)
    getUploadsInIds(allFeaturedImagesIds)
  }, [])

  useEffect(() => {
    getPosts(currentPage)
  }, [currentPage, getPosts])

  let paginationLinks = []

  if (posts.pagination && posts.pagination.totalPages > 1) {
    for (
      let pageNumber = 1;
      pageNumber <= posts.pagination.totalPages;
      pageNumber++
    ) {
      paginationLinks.push(
        <Link
          className={pageNumber === currentPage ? classes.active : ''}
          key={pageNumber}
          to={`/?page=${pageNumber}`}
        >
          {pageNumber}
        </Link>
      )
    }
  }

  return (
    <>
      <ul className={classes.postList}>
        {posts.contents &&
          posts.contents.map((p) => {
            const postFeaturedImage = featuredImages.find(
              (f) => f.id === p.featuredImage
            )

            return (
              <Link key={p.id} to={`/post/${p.id}`}>
                <li>
                  {postFeaturedImage && (
                    <img
                      src={postFeaturedImage.path}
                      alt={postFeaturedImage.originalName}
                    />
                  )}
                  <h2>{p.title}</h2>
                  <div>Created By: {p.createdBy}</div>
                  <div>Updated By: {p.updatedBy}</div>
                  <div>Created At: {p.createdAt}</div>
                  <div>Updated At: {p.updatedAt}</div>
                  <div></div>
                </li>
              </Link>
            )
          })}
      </ul>
      {posts.pagination && posts.pagination.totalPages > 1 && (
        <div className={classes.paginationWrapper}>{paginationLinks}</div>
      )}
    </>
  )
}
