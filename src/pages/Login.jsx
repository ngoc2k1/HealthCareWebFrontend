import { Button, Form, Input, Segmented, notification } from "antd";
import React, { useState } from "react";
import Logo from "../components/Logo";
import adminApi from "../api/adminApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleLogin = (data) => {
    adminApi.login(data).then((res) => {
      console.log(res);
      if (res.code === 200) {
        api.success({
          message: "Success",
          description: res.msg,
          placement: "top",
        });
        localStorage.setItem("token", res.data.token);
        window.location.replace("/")
      } else if (res.code === 400) {
        api.error({
          message: "Error",
          description: res.msg,
          placement: "top",
        });
      }
    });
  };

  return (
    <div className="login">
      <div className="wrapper">
        <div className="login_header">
          <div className="login_header_logo">
            <Logo />
          </div>
          <span>Login to your account</span>
        </div>
        <div className={`login_body`}>
          <div className="login_form">
            <Form
              name="form"
              form={form}
              validateTrigger="onSubmit"
              layout="vertical"
              autoComplete="off"
              requiredMark={false}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                name: "Specialty A",
              }}
              onFinish={handleLogin}
            >
              <Form.Item
                label="Phone Or Email"
                name="phoneOrEmail"
                rules={[
                  {
                    required: true,
                    message: "Phone or email cannot be empty",
                  },
                ]}
              >
                <Input placeholder="Phone Or Email" size="large" />
              </Form.Item>
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
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", marginTop: 12 }}
                  size="large"
                >
                  Login as Admin
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default Login;
