import React from 'react';
import dayjs from 'dayjs';

interface Props {
  date: string | number | void;
  dateFormat?: string;
}
const Wrap: React.FC<Props> = React.memo((props) => {
  const { date, dateFormat = 'YYYY-MM-DD HH:mm:ss' } = props;
  return <>{date ? dayjs(date).format(dateFormat) : ''}</>;
});

export default Wrap;
