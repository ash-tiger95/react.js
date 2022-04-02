import React, { useState } from "react";
import { Collapse, Radio } from "antd";
const { Panel } = Collapse;

function RadioBox(props) {
  const [value, setValue] = useState(0);

  const renderRadioBox = () =>
    props.list &&
    props.list.map((value) => (
      <Radio key={value._id} value={value._id}>
        {value.name}
      </Radio>
    ));

  const handleChange = (event) => {
    setValue(event.target.value);
    props.handleFilters(event.target.value); // 부모로 전달
  };

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Price" key="1">
          {/* Radio value와 Radio.Group(하나만 클릭되기 위함) value와 같아야 버튼 클린한 것으로 감지 => handleChange에서 set으로 동일화 */}
          <Radio.Group onChange={handleChange} value={value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
