import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Container, Table, Form, Col, Row, Button } from "react-bootstrap";
import 'antd/dist/antd.css';
import { DatePicker, Space } from 'antd';
interface IBoardListItem {

  onSearch: (searchInfo: any) => void;

}

export const MemberSearchItem = React.memo(
  ({
    onSearch,
  }: IBoardListItem) => {
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';

    const [startDate, setStartDate] = useState<any>('');
    const [endDate, setEndDate] = useState<any>('');
    const [keyword, setKeyword] = useState<string>('');
    const [keyValue, setKeyValue] = useState<string>('');
    const [userType, setUserType] = useState<string>('');
    const [searchPushActive, setSearchPushActive] = useState<string>('');
    const [dateSelect, setDateSelect] = useState('all')



    const onChangeDate = (_: any, dateStrings: [string, string]) => {
      const [start, end] = dateStrings;
      setStartDate(start);
      setEndDate(end);
    };

    const onChangeKeyword = (e: any) => {
      setKeyword(e.target.value);
    }
    const onChangeValue = (e: any) => {
      setKeyValue(e.target.value);
    }
    const onMemberTypeSelected = (e: any) => {
      setUserType(e.target.value);
    }
    const onADPushSelected = (e: any) => {
      setSearchPushActive(e.target.value);
    }
    const handleClickRadioButton = (dateType: any) => {
      setDateSelect(dateType);
    }

    const onReSearch = (e: any) => {
      e.preventDefault();
      onSearch({
        size: 20, keyword: keyword, keyValue: keyValue,
        startDate: dateSelect === 'all' ? '' : startDate,
        endDate: dateSelect === 'all' ? '' : endDate,
        userType: userType, searchPushActive: searchPushActive
      })
    }

    return (
      <Container>
        <Row md={4} style={{ marginBottom: '10px', paddingRight: '10px' }}>
          <Col md={{ span: 4, offset: 11 }}>
            <Button
              variant="outline-secondary"
              onClick={onReSearch}
            >??????</Button>
          </Col>
        </Row>
        <Table variant="white" bordered >

          <tbody>
            <tr>

              <td style={{ width: '10%' }}>?????? ??????</td>
              <td style={{ width: '50%' }}>
                <input
                  type='radio'
                  id='period'
                  checked={dateSelect === 'all'}
                  onChange={() => handleClickRadioButton('all')} />
                <label htmlFor='radio'>??????</label>
                <input
                  style={{ marginLeft: '10px' }}
                  type='radio'
                  id='period'
                  checked={dateSelect === 'searchDate'}
                  onChange={() => handleClickRadioButton('searchDate')} />
                <label htmlFor='radio'>?????? ??????</label>

                <Space direction="vertical" size={12} style={{ marginLeft: '10px' }}>
                  <RangePicker
                    format={dateFormat}
                    onChange={onChangeDate}
                    disabled={dateSelect === 'all'}
                  />
                </Space>
              </td>

              <td style={{ width: '20%' }}>?????? ??????</td>
              <td style={{ width: '20%' }}>
                <Form.Select aria-label="Default select example" onChange={onMemberTypeSelected}>
                  <option value="">??????</option>
                  <option value="CHANNEL">??????</option>
                  <option value="NORMAL">??????</option>
                </Form.Select>
              </td>
            </tr>
            <tr>
              <td>?????? ??????</td>
              <td>
                <Form.Select style={{ width: "30%", float: "left" }}
                  aria-label="Default select example"
                  value={keyword}
                  onChange={onChangeKeyword}
                >
                  <option value="">??????</option>
                  <option value="ID">?????????</option>
                  <option value="NAME">??????</option>
                </Form.Select>
                <Form style={{ width: "60%", float: "left", marginLeft: '10px' }} onSubmit={onReSearch}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control type="text" placeholder="" value={keyValue} onChange={onChangeValue} />
                  </Form.Group>
                </Form>
              </td>
              <td>????????? ?????? ??????</td>
              <td>
                <Form.Select aria-label="Default select example" onChange={onADPushSelected}>
                  <option value="">??????</option>
                  <option value="Y">??????</option>
                  <option value="N">?????????</option>
                </Form.Select>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    );
  },
);

