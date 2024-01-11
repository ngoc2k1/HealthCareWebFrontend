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

const DoctorForm = () => {//quản lý và lấy thông tin cần thiết
  const location = useLocation();//url hiện tại
  const { id } = useParams();//lấy id từ url
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
              message: "",
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
              message: "",
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
      <PageTitle>{id ? "Sửa bác sĩ" : "Thêm bác sĩ"}</PageTitle>
      <Form
        name="form"
        form={form}
        validateTrigger="onSubmit"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}//call api
        style={{
          maxWidth: 600,
        }}
        requiredMark={false}
      
      >
       
        <Spin spinning={isUploading}>
          <Form.Item //check valid
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên không được để trống",
              },
            ]}
          >
            <Input placeholder="Tên" maxLength={200} showCount />
          </Form.Item>
          <Form.Item
            label="Số điện thoại "
            name="phone"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống",
              },
            ]}
          >
            <Input placeholder="Số điện thoại" maxLength={200} showCount />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được để trống",
              },
            ]}
          >
            <Input placeholder="Email" maxLength={200} showCount />
          </Form.Item>
          {id ? (
            <Form.Item label="Mật khẩu (Để trống nếu không muốn cập nhật)" name="password">
              <Input.Password placeholder="Mật khẩu" maxLength={200} showCount />
            </Form.Item>
          ) : (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu không được để trống",
                },
              ]}
            >
              <Input.Password placeholder="Mật khâu" maxLength={200} showCount />
            </Form.Item>
          )}
          <Form.Item
            label="Chuyên khoa"
            name="specialtyId"
            rules={[
              {
                required: true,
                message: "Chuyên khoa không được để trống",
              },
            ]}
          >
            <Select
              options={specialtyData.map((item) => ({ value: item.id, label: item.name }))}
              onChange={(value, selectedOptions) => {
                console.log(value, selectedOptions);
              }}
              placeholder="Chọn Chuyên khoa"
            />
          </Form.Item>
          <Form.Item
            label="Ảnh đại diện"
            name="avatar"
            required
            rules={[
              {
                validator(_, value) {
                  if (fileList.length === 0) {
                    return Promise.reject("Ảnh đại diện không được để trống");
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
                  <div>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[
              {
                required: true,
                message: "Ngày sinh không được để trống",
              },
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ khám"
            name="addressTest"
            rules={[
              {
                required: true,
                message: "Địa chỉ khám không được để trống",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Địa chỉ khám" maxLength={5000} showCount />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[
              {
                required: true,
                message: "Giới tính không được để trống",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="MALE">Nam</Radio>
              <Radio value="FEMALE">Nữ</Radio>
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
              label="Căn cước công dân"
              name="identityCard"
              rules={[
                {
                  required: true,
                  message: "Căn cước công dân không được để trống",
                },
              ]}
            >
              <Input placeholder="Căn cước công dân" maxLength={200} showCount />
            </Form.Item>
            <Form.Item
              label="Bảo hiểm y tế"
              name="healthInsurance"
              rules={[
                {
                  required: true,
                  message: "Bảo hiểm y tế không được để trống",
                },
              ]}
            >
              <Input placeholder="Bảo hiểm y tế" maxLength={200} showCount />
            </Form.Item>
          </div>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" style={{ width: 200 }}>
              Lưu
            </Button>
          </Form.Item>
        </Spin>
      </Form>

      {contextHolder}
    </>
  );
};

export default DoctorForm;
