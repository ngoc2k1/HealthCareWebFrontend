import { LogoutOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Logo from "./components/Logo";
import PrivatePage from "./components/PrivatePage";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import DoctorForm from "./pages/doctor/DoctorForm";
import DoctorList from "./pages/doctor/DoctorList";
import SpecialtyForm from "./pages/specialty/SpecialtyForm";
import SpecialtyList from "./pages/specialty/SpecialtyList";
import DoctorWorkScheduleEdit from "./pages/work-schedule/DoctorWorkScheduleEdit";
import "./scss/index.scss";

const { Content, Sider } = Layout;
const items = [

  {
    label: "Bác sĩ",
    url: "/doctor",
    icon: UserOutlined,
  },
  {
    label: "Chuyên khoa",
    url: "/specialty",
    icon: UnorderedListOutlined,
  },
].map((item, index) => {
  const key = String(index + 1);

  if (!item.children) {
    return {
      key: `sub${key}`,
      icon: React.createElement(item.icon),
      label:
        item.label === "User" ? (
          <Link to={item.url} target="_blank">
            {item.label}
          </Link>
        ) : (
          <Link to={item.url}>{item.label}</Link>
        ),
    };
  }

  return {
    key: `sub${key}`,
    icon: React.createElement(item.icon),
    label: item.label,
    children: item.children.map((it, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: <Link to={it.url}>{it.label}</Link>,
      };
    }),
  };
});

const App = () => {

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload()
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          <PrivatePage
            page={
              <Layout style={{ height: "100vh" }}>
                <Layout>
                  <Sider
                    width={260}
                    style={{
                      background: "white",
                    }}
                  >
                    <div className="app_logo">
                      <Logo />
                    </div>
                    <Menu
                      mode="inline"
                      defaultSelectedKeys={["1"]}
                      defaultOpenKeys={["sub1"]}
                      style={{
                        borderRight: 0,
                        overflow: "auto",
                        height: "calc(100% - 110px)",
                      }}
                      items={items}
                    />
                    <div className="sider_footer">
                      <Button icon={<LogoutOutlined />} type="link" onClick={handleLogOut}>
                        Đăng xuất
                      </Button>
                    </div>
                  </Sider>

                  <Layout>
                    <Layout
                      style={{
                        padding: "0 0 0 12px",
                        overflowX: "hidden",
                      }}
                    >
                      <Content>
                        <div
                          style={{
                            padding: 24,
                            minHeight: "100%",
                            backgroundColor: "white",
                          }}
                        >
                          <Routes>
                            <Route path="/" element={<DashBoard />} />
                            <Route path="/specialty" element={<SpecialtyList />} />
                            <Route path="/specialty/create" element={<SpecialtyForm />} />
                            <Route path="/specialty/update/:id" element={<SpecialtyForm />} />
                            <Route path="/doctor" element={<DoctorList />} />
                            <Route path="/doctor/create" element={<DoctorForm />} />
                            <Route path="/doctor/update/:id" element={<DoctorForm />} />
                            <Route
                              path="/doctor-work-schedule/update/:doctorId"
                              element={<DoctorWorkScheduleEdit />}
                            />
                          </Routes>
                        </div>
                      </Content>
                    </Layout>
                  </Layout>
                </Layout>
              </Layout>
            }
          />
        }
      />
    </Routes>
  );
};
export default App;
