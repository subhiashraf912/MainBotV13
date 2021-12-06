import styled, { css } from "styled-components";

export const DropdownHeader = styled.div`
  background-color: #21262d;
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`;

export const SelectMenuDropDownHeader = styled(DropdownHeader)`
  color: white;
  transition: 500ms;
  :hover {
    background-color: white;
    color: black;
    cursor: pointer;
  }
  :active {
    background-color: yellow;
  }
`;

export const DropdownCommandHeader = styled(DropdownHeader)`
  color: white;
  transition: 500ms;
  :hover {
    background-color: white;
    color: black;
    cursor: pointer;
  }
  :active {
    background-color: yellow;
  }
`;

export const SelectItem = styled.div`
  background-color: #21262d;
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  color: white;
  transition: 500ms;
  :hover {
    background-color: white;
    color: black;
    cursor: pointer;
  }
  :active {
    background-color: yellow;
  }
`;

export const CommandCategoryHeader = styled(DropdownHeader)`
  margin-right: 10px;
  margin-bottom: 10px;
  width: 150px;
  transition: 500ms;
  :hover {
    background-color: white;
    color: black;
    cursor: pointer;
  }
  :active {
    background-color: yellow;
  }
`;
interface props {
  expanded: boolean;
}
export const DropdownItemContainer = styled.div<props>`
  max-height: 0px;
  overflow-y: scroll;
  opacity: 0;
  transition: 300ms;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb {
    background-color: #171717;
    border-radius: 50px;
  }
  max-height: ${(props) => (props.expanded ? "200px" : "0px")};
  opacity: ${(props) => (props.expanded ? "1" : "0")};
`;

export const DropdownCommandContainer = styled(DropdownItemContainer)`
  padding: 20px;
  background-color: #2f3640;
  transition: 500ms;
  :hover {
    cursor: pointer;
  }
`;

export const DropdownMenuItemContainer = styled.div<props>`
  background-color: #2f3640;
  padding: 0px;
  max-height: ${(props) => (props.expanded ? "200px" : "0px")};
  opacity: ${(props) => (props.expanded ? "1" : "0")};
  overflow-y: scroll;
  transition: 300ms;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb {
    background-color: #171717;
    border-radius: 50px;
  }
  transition: 500ms;
  :hover {
    cursor: pointer;
  }
`;
