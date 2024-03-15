import { Col, Layout, Row, Spin } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import SpotCard from "./SpotCard";
import styles from "./SpotSelectBoard.module.css";
import useSpots from "./useSpots";

const SpotSelectBoard = () => {
  const { isLoading, data, error } = useSpots();
  if (isLoading) {
    return <Spin fullscreen />;
  }
  if (error) {
    return (
      <>
        Failed to get spot info.
        <pre>{error?.message || "Unknow reason."}</pre>
      </>
    );
  }
  if (data) {
    const spots = data.data;
    return (
      <>
        <Layout className={styles.layout}>
          <Header className={styles.header}>
            <Row>
              <Col>
                <p className={styles.title}>Select Spot</p>
              </Col>
            </Row>
          </Header>
          <Content className={styles.content}>
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </Content>
        </Layout>
      </>
    );
  }
  return <>No spots found</>;
};

export default SpotSelectBoard;
