import { NextPage } from 'next'
import Head from 'next/head'
import {Button, Col, Row} from 'react-bootstrap';

import styles from '../styles/Home.module.css'
import {CurrentStats, MediaItem, Tweet, TwitterApiResponseData} from '../lib/types';
import Banner from '../components/stats/Banner';
import Title from '../components/common/Title';
import User from '../components/entities/User';
import Layout from '../components/common/Layout';
import {getRecentTweets} from '../lib/repos/tweets';
import {calcBatchTweetStats, calcBatchUserStats} from '../lib/utils/stats';

const Home: NextPage<any & {stats: CurrentStats}> = ({users, stats}) => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <Layout className="layout animation tweets">
            <Row className="gx-0">
                <Col lg={6} className="col-stats">
                    <Banner title={<Title prefix="Users" className="top-50 text-center">Stats</Title>} stats={stats.users} />
                </Col>

                <Col lg={6} className="px-3">
                    <Title prefix="Top 3" className="mt-2 animated-text">Users</Title>
                    <p className="animated-text mb-3">Our special algorithm ranked these 3 users as the most prominent ones who mentioned the most loved React.Js framework.</p>
                    {users && users.slice(0, 3).map(user => <User data={user} />)}
                </Col>
            </Row>
            <Row className="gx-0">
                <Col lg={6} className="px-3 mt-5 mb-4 offset-3 text-center">
                    <Title prefix="All" className="mt-2 animated-text">Users</Title>
                    <p className="animated-text">Our special algorithm ranked these 3 users as the most prominent ones who mentioned the most loved React.Js framework.</p>
                </Col>
            </Row>
            <Row className="gx-0">
                {users && users.map(user =>
                    <Col key={user.id} lg={6} className="px-3">
                        <User data={user} />
                    </Col>
                )}
            </Row>
            <Row className="gx-0">
                <Col lg={6} className="offset-lg-3 px-3 animated-text">
                    <Button variant="outline-light" className="w-100" >Load More</Button>
                </Col>
            </Row>
        </Layout>
    </>
  )
}

export default Home


export const getServerSideProps = async () => {
    const data = await getRecentTweets();

    const tweetStats = calcBatchTweetStats(data.tweets);
    const currentStats: CurrentStats = {
        tweets: tweetStats,
        users: calcBatchUserStats(data.users, tweetStats),
    }

    return {props: {users: data.users, tweets: data.tweets, stats: currentStats}};
}