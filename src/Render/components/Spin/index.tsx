import React from 'react';
import { Spin } from 'antd';

export default class extends React.Component {
  render() {
    return (
      <section className="ui-vw-100 ui-vh-100 flex just-center align-center" style={{ background: '#041224' }}>
        <Spin />
      </section>
    );
  }
}
