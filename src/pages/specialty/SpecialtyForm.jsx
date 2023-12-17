import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, Upload, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import specialtyApi from "../../api/specialtyApi";
import fileApi from "../../api/fileApi";

const { TextArea } = Input;

const SpecialtyForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const location = useLocation();
  const { id } = useParams();

  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = (data) => {
    // console.log(data);
    const copy = Object.assign({}, data);
    copy.image = fileList[0].thumbUrl;
    console.log(copy);

    if (id) {
      specialtyApi.update(id, copy).then((res) => {
        console.log(res);
        if (res.code === 200) {
          api.success({
            message: "Success",
            description: res.msg,
            placement: "top",
          });
        }
      }).catch(err => {
        const data = err.response.data;
        console.log(data)
        if (data.data === "name") {
          form.setFields([
            {
              name: "name",
              errors: [data.msg],
            },
          ]);
        }
      });
    } else {
      specialtyApi.create(copy).then((res) => {
        console.log(res)
        if (res.code === 201) {
          api.success({
            message: "Success",
            description: res.msg,
            placement: "top",
          });
        }
      }).catch(err => {
        const data = err.response.data;
        console.log(data)
        if (data.data === "name") {
          form.setFields([
            {
              name: "name",
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

  useEffect(() => {
    if (id) {
      specialtyApi.getById(id).then((res) => {
        console.log(res);
        form.setFields([
          {
            name: "name",
            value: res.data.name,
          },
        ]);
        setFileList([
          {
            uid: "-1",
            name: "xxx.png",
            status: "done",
            thumbUrl: res.data.image,
          },
        ]);
      });
    }
  }, []);

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

  return (
    <>
      <PageTitle>{id ? "Update Specialty" : "Create New Specialty"}</PageTitle>

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
        // initialValues={{
        //   name: "Specialty A",
        // }}
        requiredMark={false}
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
            label="Image"
            name="image"
            required
            rules={[
              {
                validator(_, value) {
                  if (fileList.length === 0) {
                    return Promise.reject("Image cannot be empty");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Upload
              action="http://localhost:8080/api/v1/file/upload"
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

export default SpecialtyForm;
