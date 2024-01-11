import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Space, Table, Tag, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { getTime } from "../../utils/formatTime";
import specialtyApi from "../../api/specialtyApi";

const SpecialtyList = () => {
  const [deleteSpecialtyId, setDeleteSpecialtyId] = useState(null);
  const [data, setData] = useState([]);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    specialtyApi.getAll().then((res) => {
      setData(res.data);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (url) => <Avatar src={url} size="large" />,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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
          <Link to={`/specialty/update/${record.id}`}>
            <Button shape="circle" size="large">
              <EditOutlined />
            </Button>
          </Link>
          <Button
            shape="circle"
            size="large"
            onClick={() => {
              setDeleteSpecialtyId(record.id);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageTitle
        extra={
          <Link to={"/specialty/create"}>
            <Button type="primary">Thêm chuyên khoa</Button>
          </Link>
        }
      >
        Quản lý chuyên khoa
      </PageTitle>

      <Table
        className="addresses"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          x: 1000,
        }}
        bordered={true}
        rowKey={"id"}
      />

      <Modal
        title="Xóa chuyên khoa"
        open={!!deleteSpecialtyId}
        onOk={() => {
          specialtyApi.deleteById(deleteSpecialtyId).then((res) => {
            specialtyApi.getAll().then((res) => {
              setData(res.data);
              setDeleteSpecialtyId(null);
              api.success({
                message: "",
                description: "Xóa thành công",
                placement: "top",
              });
            });
          });
        }}
        onCancel={() => setDeleteSpecialtyId(null)}
        centered
        mousePosition={{}}
      >
        Xóa chuyên khoa sẽ xóa hết những thứ liên quan đến chuyên khoa. Tiếp tục?
      </Modal>
      {contextHolder}
    </>
  );
};

export default SpecialtyList;
