import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    // 누른것의 index를 구하고
    const currentIndex = checked.indexOf(value);

    // 전체 Checked된 State에서 현재 누른 CheckBox가 있다면
    const newChecked = [...checked];
    if (currentIndex === -1) {
      // 넣어주고
      newChecked.push(value);
    } else {
      // 빼주고
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked); // 부모 컴포넌트에 전달
  };
  const renderCheckBoxList = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={checked.indexOf(value._id) === -1 ? false : true}
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Continents" key="1">
          {renderCheckBoxList()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
