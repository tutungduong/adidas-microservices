"use client";
import type { NextPage } from 'next'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import { useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/sessionSlice'
import flashMessage from '../../components/shared/flashMessages'
import { request, gql } from 'graphql-request'
import useUserApi from '../../graphql/userApi'
import { User } from '@/types/user/user';
import javaService from '@/api/services/javaService';

const Index: NextPage = () => {
  const [users, setUsers] = useState([] as User[])
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser);

  const setUsersList= useCallback(async () => { 
    javaService.getUsers({page: page}
    ).then(response => {
      if (response.users) {
        setUsers(response.users)
        setTotalCount(response.total_count)
      } else {
        setUsers([])
      }
    })
    .catch(error => {
      console.log(error)
    })

    // const data = useUserApi.index()
    // console.log(data)
  }, [page])

  useEffect(() => {
    setUsersList()
  }, [setUsersList])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const removeUser = (index: number, userid: string) => {
    let sure = window.confirm("You sure?")
    if (sure === true) {
      javaService.deleteUser(userid
      ).then(response => {
          if (response.flash) {
            Array.isArray(response.flash)
              ? flashMessage(response.flash[0], response.flash[1])
              : flashMessage("info", response.flash)
            setUsersList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <>
    <h1>All users</h1>

    <Pagination
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={total_count}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
    />

    <ul className="users">
      {users.map((u, i) => (
      <li key={i}>
        <Image
          className={"gravatar"}
          src={"https://secure.gravatar.com/avatar/"+u.gravatar_id+"?s=50"}
          alt={u.name}
          width={50}
          height={50}
          priority
        />
        <a href={'/users/'+u.id}>{u.name}</a>
        {
          current_user.value && current_user.value.role && current_user.value.id !== u.id ? (
            <>
            | <a href={'#/users/'+u.id} onClick={() => removeUser(i, u.id)}>delete</a>
            </>
          ) : (
            <></>
          )
        }
      </li>
      ))}
    </ul>

    <Pagination
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={total_count}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
    />
    </>
  )
}

export default Index
