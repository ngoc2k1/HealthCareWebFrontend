import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, InputNumber, Spin, TimePicker, notification } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import scheduleApi from "../../api/scheduleApi";

const DoctorWorkScheduleEdit = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const { doctorId } = useParams();
  const [error, setError] = useState([]);
  const [isChangeDate, setIsChangeDate] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const date = queryString.parse(location.search).date;

    if (date) {
      setIsChangeDate(true);
      form.setFields([{ name: "date", value: dayjs(date, "YYYY/MM/DD") }]);
      scheduleApi.getTimeByDoctor(doctorId, date).then((res) => {
        console.log(res.data);
        const times = [];
        for (const item of res.data) {
          const value = item.value;
          const start = value.split(" - ")[0];
          const end = value.split(" - ")[1];
          times.push({
            time: [dayjs(start, "HH:mm"), dayjs(end, "HH:mm")],
            price: item.price,
            id: item.id,
          });
        }
        form.setFields([{ name: "times", value: times }]);
        setIsChangeDate(false);
      });
    }
  }, []);

  const handleSubmit = () => {
    setError([]);
    form
      .validateFields()
      .then((data) => {
        const copy = Object.assign({}, data);
        copy.doctorId = doctorId;
        copy.date = copy.date.format("YYYY/MM/DD");

        copy.times = copy.times.map((item) => ({
          id: item.id,
          start: item.time[0].format("HH:mm"),
          end: item.time[1].format("HH:mm"),
          price: item.price,
        }));

        function checkDuplicate(timeA, timeB) {
          const start1 = new Date(`2023-01-01T${timeA.start}`);
          const end1 = new Date(`2023-01-01T${timeA.end}`);
          const start2 = new Date(`2023-01-01T${timeB.start}`);
          const end2 = new Date(`2023-01-01T${timeB.end}`);

          return start1 < end2 && end1 > start2;
        }

        let trungNhau = false;
        let errors = [];

        for (let i = 0; i < copy.times.length - 1; i++) {
          for (let j = i + 1; j < copy.times.length; j++) {
            if (checkDuplicate(copy.times[i], copy.times[j])) {
              trungNhau = true;
              errors.push(
                `Duplicate: '${copy.times[i].start} - ${copy.times[i].end}' and '${copy.times[j].start} - ${copy.times[j].end}'`
              );
            }
          }
        }

        if (!trungNhau) {
          setError([]);
          console.log(copy);
          scheduleApi.editSchedule(copy).then((res) => {
            console.log(res);
            if (res.code === 200) {
              api.success({
                message: "Success",
                description: res.msg,
                placement: "top",
              });
            }
          });
        } else {
          setError(errors);
        }
      })
      .catch((err) => {});
  };

  const handleChangeDate = (v) => {
    setIsChangeDate(true);
    const date = v.format("YYYY/MM/DD");
    scheduleApi.getTimeByDoctor(doctorId, date).then((res) => {
      console.log(res.data);
      const times = [];
      for (const item of res.data) {
        const value = item.value;
        const start = value.split(" - ")[0];
        const end = value.split(" - ")[1];
        times.push({
          time: [dayjs(start, "HH:mm"), dayjs(end, "HH:mm")],
          price: item.price,
          id: item.id,
        });
      }
      form.setFields([{ name: "times", value: times }]);
      setIsChangeDate(false);
    });
  };

  return (
    <>
      <PageTitle>Manage Doctor Work Schedule</PageTitle>
      <Spin spinning={isChangeDate}>
        <Form
          name="form"
          form={form}
          validateTrigger="onSubmit"
          labelWrap
          layout="vertical"
          labelAlign="left"
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          className="form"
          // initialValues={{
          //   date: dayjs("2023/01/01", "YYYY/MM/DD"),
          //   times: [
          //     {
          //       time: [dayjs("08:00", "HH:mm"), dayjs("10:00", "HH:mm")],
          //       price: 100000,
          //     },
          //     {
          //       time: [dayjs("08:00", "HH:mm"), dayjs("10:00", "HH:mm")],
          //       price: 100000,
          //     },
          //   ],
          // }}
        >
          <Form.Item
            name="date"
            label="Date"
            rules={[
              {
                required: true,
                message: "Date cannot be empty",
              },
            ]}
          >
            <DatePicker
              placeholder="Select date"
              style={{ width: "100%" }}
              format={"YYYY/MM/DD"}
              disabled={!!queryString.parse(location.search).date}
              onChange={handleChangeDate}
            />
          </Form.Item>

          <Form.Item label="Time" required>
            <Form.List
              name="times"
              // rules={[
              //   {
              //     validator: async (_, names) => {
              //       if (!names || names.length < 1) {
              //         return Promise.reject(new Error("At least 1 schedules"));
              //       }
              //     },
              //   },
              // ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: "flex", width: "100%", alignItems: "start" }}>
                      <Form.Item name={[name, "id"]} style={{ marginLeft: 12 }} hidden>
                        <InputNumber placeholder="Id" style={{ width: 160 }} />
                      </Form.Item>
                      <Form.Item
                        name={[name, "time"]}
                        rules={[
                          {
                            required: true,
                            message: "Time cannot be empty",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <TimePicker.RangePicker
                          placeholder={["Start", "End"]}
                          format={"HH:mm"}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[name, "price"]}
                        rules={[
                          {
                            required: true,
                            message: "Price cannot be empty",
                          },
                        ]}
                        style={{ marginLeft: 12 }}
                      >
                        <InputNumber placeholder="Price" style={{ width: 160 }} addonAfter="đ" />
                      </Form.Item>
                      <DeleteOutlined
                        onClick={() => remove(name)}
                        style={{ padding: "0 12px", height: 32 }}
                      />
                    </div>
                  ))}
                  {error.length ? (
                    <Form.Item>
                      <Form.ErrorList errors={error} />
                    </Form.Item>
                  ) : (
                    <></>
                  )}
                  <Form.Item noStyle>
                    <Button onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Time
                    </Button>
                  </Form.Item>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item label colon={false}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit} style={{ width: 200 }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
      {contextHolder}
    </>
  );
};

export default DoctorWorkScheduleEdit;
