import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  Table,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import doctorApi from "../../api/doctorApi";
import specialtyApi from "../../api/specialtyApi";
import fileApi from "../../api/fileApi";

const { TextArea } = Input;

const DoctorForm = () => {
  const location = useLocation();
  const { id } = useParams();
  const [api, contextHolder] = notification.useNotification();

  const [isUploading, setIsUploading] = useState(false);

  const [form] = Form.useForm();

  const [data, setData] = useState();
  const [specialtyData, setSpecialtyData] = useState([]);

  const handleSubmit = (data) => {
    const copy = Object.assign({}, data);
    copy.avatar = fileList[0].thumbUrl;
    copy.birthday = copy.birthday.format("DD/MM/YYYY");
    console.log(copy);

    if (id) {
      doctorApi
        .update(id, copy)
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            api.success({
              message: "Success",
              description: res.msg,
              placement: "top",
            });
          }
        })
        .catch((err) => {
          const data = err.response.data;
          console.log(data);
          if (data.data === "email") {
            form.setFields([
              {
                name: "email",
                errors: [data.msg],
              },
            ]);
          } else if (data.data === "phone") {
            form.setFields([
              {
                name: "phone",
                errors: [data.msg],
              },
            ]);
          }
        });
    } else {
      doctorApi
        .create(copy)
        .then((res) => {
          console.log(res);
          if (res.code === 201) {
            api.success({
              message: "Success",
              description: res.msg,
              placement: "top",
            });
          }
        })
        .catch((err) => {
          const data = err.response.data;
          console.log(data);
          if (data.data === "email") {
            form.setFields([
              {
                name: "email",
                errors: [data.msg],
              },
            ]);
          } else if (data.data === "phone") {
            form.setFields([
              {
                name: "phone",
                errors: [data.msg],
              },
            ]);
          }
        });
    }
  };

  useEffect(() => {
    // form.resetFields();
  }, [location.pathname]);

  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]) {
      console.log(newFileList[0].originFileObj);

      const formData = new FormData();
      formData.append("file", newFileList[0].originFileObj);
      setIsUploading(true);

      fileApi.upload(formData).then((res) => {
        console.log(res);
        setFileList([
          {
            uid: "-1",
            name: "xxx.png",
            status: "done",
            thumbUrl: res.data,
          },
        ]);

        setIsUploading(false);
      });
    }
  };

  useEffect(() => {
    specialtyApi.getAll().then((res) => {
      setSpecialtyData(res.data);
    });

    if (id) {
      doctorApi.getById(id).then((res) => {
        console.log(res);
        form.setFields([
          {
            name: "name",
            value: res.data.name,
          },
          {
            name: "phone",
            value: res.data.phone,
          },
          {
            name: "email",
            value: res.data.email,
          },
          {
            name: "addressTest",
            value: res.data.addressTest,
          },
          {
            name: "gender",
            value: res.data.gender,
          },
          {
            name: "identityCard",
            value: res.data.identityCard,
          },
          {
            name: "healthInsurance",
            value: res.data.healthInsurance,
          },
          {
            name: "birthday",
            value: dayjs(res.data.birthday, "DD/MM/YYYY"),
          },
          {
            name: "specialtyId",
            value: res.data.specialty.id,
          },
        ]);
        setFileList([
          {
            uid: "-1",
            name: "xxx.png",
            status: "done",
            thumbUrl: res.data.avatar,
          },
        ]);
      });
    }
  }, []);

  return (
    <>
      <PageTitle>{id ? "Edit Doctor" : "Create New Doctor"}</PageTitle>
      <Form
        name="form"
        form={form}
        validateTrigger="onSubmit"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        style={{
          maxWidth: 600,
        }}
        requiredMark={false}
        // initialValues={{
        //   gender: "MALE",
        //   name: "Doctor A",
        //   phone: "0123456789",
        //   email: "doctor@gmail.com",
        //   password: "12345",
        //   specialty: 2,
        //   addressTest: "Address Test",
        //   identityCard: "123456789",
        //   healthInsurance: "987654321",
        // }}
      >
        <Spin spinning={isUploading}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name cannot be empty",
              },
            ]}
          >
            <Input placeholder="Name" maxLength={200} showCount />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Phone cannot be empty",
              },
            ]}
          >
            <Input placeholder="Phone" maxLength={200} showCount />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email cannot be empty",
              },
            ]}
          >
            <Input placeholder="Email" maxLength={200} showCount />
          </Form.Item>
          {id ? (
            <Form.Item label="Password (Để trống nếu không muốn cập nhật)" name="password">
              <Input.Password placeholder="Password" maxLength={200} showCount />
            </Form.Item>
          ) : (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password cannot be empty",
                },
              ]}
            >
              <Input.Password placeholder="Password" maxLength={200} showCount />
            </Form.Item>
          )}
          <Form.Item
            label="Specialty"
            name="specialtyId"
            rules={[
              {
                required: true,
                message: "Specialty cannot be empty",
              },
            ]}
          >
            <Select
              options={specialtyData.map((item) => ({ value: item.id, label: item.name }))}
              onChange={(value, selectedOptions) => {
                console.log(value, selectedOptions);
              }}
              placeholder="Select Specialty"
            />
          </Form.Item>
          <Form.Item
            label="Avatar"
            name="avatar"
            required
            rules={[
              {
                validator(_, value) {
                  if (fileList.length === 0) {
                    return Promise.reject("Avatar cannot be empty");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Upload
              // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              fileList={fileList}
              onChange={onChange}
              beforeUpload={() => false}
              showUploadList={{
                showPreviewIcon: false,
              }}
              listType="picture-card"
              accept="image/*"
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Birthday"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Birthday cannot be empty",
              },
            ]}
          >
            <DatePicker
              placeholder="Select Birthday"
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>

          <Form.Item
            label="Address Test"
            name="addressTest"
            rules={[
              {
                required: true,
                message: "Address Test cannot be empty",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Address Test" maxLength={5000} showCount />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: "Gender cannot be empty",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="MALE">MALE</Radio>
              <Radio value="FEMALE">FEMALE</Radio>
              <Radio value="OTHER">OTHER</Radio>
            </Radio.Group>
          </Form.Item>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: 12,
            }}
          >
            <Form.Item
              label="Identity Card"
              name="identityCard"
              rules={[
                {
                  required: true,
                  message: "Identity Card cannot be empty",
                },
              ]}
            >
              <Input placeholder="Identity Card" maxLength={200} showCount />
            </Form.Item>
            <Form.Item
              label="Health Insurance"
              name="healthInsurance"
              rules={[
                {
                  required: true,
                  message: "Health Insurance cannot be empty",
                },
              ]}
            >
              <Input placeholder="Health Insurance" maxLength={200} showCount />
            </Form.Item>
          </div>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" style={{ width: 200 }}>
              Save
            </Button>
          </Form.Item>
        </Spin>
      </Form>

      {contextHolder}
    </>
  );
};

export default DoctorForm;
