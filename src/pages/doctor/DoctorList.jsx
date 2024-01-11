import { DeleteOutlined, EditOutlined, ScheduleOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Modal, Space, Table, Tag, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import doctorApi from "../../api/doctorApi";
import scheduleApi from "../../api/scheduleApi";
import PageTitle from "../../components/PageTitle";
import { getTime } from "../../utils/formatTime";

const DoctorList = () => {
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [doctorIdEditSchedule, setDoctorIdEditSchedule] = useState();
  const [schedules, setSchedules] = useState([]);

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);

  useEffect(() => {//mỗi khi page thay đổi, update lại data
    doctorApi.getAll(page).then((res) => {
      console.log(res);
      setData(res);
    });
  }, [page]);

  useEffect(() => {
    if (doctorIdEditSchedule) {
      scheduleApi.getDateByDoctor(doctorIdEditSchedule).then((res) => {
        console.log(setSchedules(res.data));
      });
    }
  }, [doctorIdEditSchedule]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => <Avatar src={url} size="large" />,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (
        <Tag color={text === "MALE" ? "blue" : text === "FEMALE" ? "green" : "default"}>{text}</Tag>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      key: "specialty",
      render: (item) => <a>{item.name}</a>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <Tag color="magenta">{getTime(text)}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/doctor/update/${record.id}`}>
            <Button shape="circle" size="large">
              <EditOutlined />
            </Button>
          </Link>
          <Button
            shape="circle"
            size="large"
            onClick={() => {
              setDeleteDoctorId(record.id);
            }}
          >
            <DeleteOutlined />
          </Button>
          <Button
            shape="circle"
            size="large"
            onClick={() => {
              setDoctorIdEditSchedule(record.id);
            }}
          >
            <ScheduleOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageTitle
        extra={
          <Link to={"/doctor/create"}>
            <Button type="primary">Thêm bác sĩ</Button>
          </Link>
        }
      >
        Quản lý bác sĩ
      </PageTitle>

      <Table
        className="addresses"
        columns={columns}
        dataSource={data.data}
        pagination={{
          onChange: (v) => setPage(v),
          total: data.totalPage * data.perPage,
          showSizeChanger: false,
          current: page,
          pageSize: data.perPage,
        }}
        scroll={{
          x: 1000,
        }}
        bordered={true}
        rowKey={"id"}
      />

      <Modal
        title="Xóa bác sĩ"
        open={!!deleteDoctorId}
        onOk={() => {
          doctorApi.deleteById(deleteDoctorId).then((res) => {
            doctorApi.getAll(page).then((res) => {
              setData(res);
              setDeleteDoctorId(null);
              api.success({
                message: "",
                description: "Xóa thành công",
                placement: "top",
              });
            });
          });
        }}
        onCancel={() => setDeleteDoctorId(null)}
        centered
        mousePosition={{}}
      >
        Xóa bác sĩ sẽ xóa hết những thứ liên quan đến bác sĩ. Tiếp tục?
      </Modal>

      <Modal
        title="Lịch làm việc"
        open={!!doctorIdEditSchedule}
        onOk={() => {}}
        onCancel={() => setDoctorIdEditSchedule()}
        centered
      >
        <Form.Item>
          <Link to={`/doctor-work-schedule/update/${doctorIdEditSchedule}`}>
            <Button>Thêm ngày mới</Button>
          </Link>
        </Form.Item>
        <Table
          className="addresses"
          columns={[
            {
              title: "Ngày",
              render: (_, row) => <a>{row}</a>,
            },
            {
              title: "Hành động",
              key: "action",
              render: (_, record) => (
                <Space>
                  <Link to={`/doctor-work-schedule/update/${doctorIdEditSchedule}?date=${record}`}>
                    <Button shape="circle" size="large">
                      <EditOutlined />
                    </Button>
                  </Link>
                </Space>
              ),
            },
          ]}
          dataSource={schedules}
          pagination={false}
          bordered={true}
          rowKey={(r) => r}
        />
      </Modal>
      {contextHolder}
    </>
  );
};

export default DoctorList;
