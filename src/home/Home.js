import React, { useState } from 'react';
import {
  Card, Col, Row, Select, Statistic,
} from 'antd';
import { useQuery } from 'react-query';
import { EmptyListWrapper } from '../core/EmptyListWrapper';
import { PremisesService } from '../services/api.service';

const Home = () => {
  const [premises, setPremises] = useState(null);

  const { data: premisesStatistic } = useQuery(
    ['premisesStats', premises],
    () => PremisesService.getStatistic(premises),
    {
      enabled: !!premises,
      select: (data) => data.data,
    },
  );

  const {
    isFetching: isLoading, data: premisesOptions,
  } = useQuery('premises', () => PremisesService.query(), {
    onSuccess({ data: initialPremises }) {
      if (initialPremises.length) setPremises(initialPremises[0].id);
    },
  });

  return (
    <>
      <Row gutter={16}>
        <EmptyListWrapper list={premisesOptions?.data} emptyMessage="Please add premises first">
          <Row justify="space-between">
            <Col style={{ marginBottom: '1em' }}>
              <Select
                style={{ width: 200 }}
                options={premisesOptions?.data.map((option) => ({
                  value: option.id,
                  label: option.name,
                }))}
                onSelect={(value) => setPremises(value)}
                loading={isLoading}
                defaultValue={premisesOptions?.data[0]?.id}
              />
            </Col>
          </Row>
        </EmptyListWrapper>
      </Row>
      <Row gutter={16} justify="start" style={{ marginBottom: '1em' }}>
        <Col span={8}>
          <Card>
            <Statistic title="Active Orders" value={premisesStatistic?.active_orders} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Completed Orders" value={premisesStatistic?.completed_orders} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} justify="start">
        <Col span={8}>
          <Card>
            <Statistic title="Today's income" value={premisesStatistic?.today_balance} precision={2} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Month income" value={premisesStatistic?.month_balance} precision={2} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
