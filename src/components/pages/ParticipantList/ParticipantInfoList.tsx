import useParticipantInfoMapStore from "@/components/basics/ParticipantInfoGroup/useParticipantInfoMapStore";
import ParticipantInfoPanel from "@/components/basics/ParticipantInfoPanel/ParticipantInfoPanel";
import { Col, Row, Typography } from "antd";
import { ReactNode } from "react";

const ParticipantInfoList = () => {
  const participantInfoMap = useParticipantInfoMapStore();
  const participantInfoPanels: ReactNode[] = [];

  participantInfoMap.items.forEach((participantInfo, key) => {
    participantInfoPanels.push(
      <ParticipantInfoPanel
        key={key}
        playerId={participantInfo.playerId}
        isShowFace={true}
      />,
    );
  });

  return (
    <>
      <Row gutter={8}>
        <Col span={24}>
          <Typography.Title level={5}>Participants List</Typography.Title>
          {participantInfoPanels}
        </Col>
      </Row>
    </>
  );
};

export default ParticipantInfoList;
