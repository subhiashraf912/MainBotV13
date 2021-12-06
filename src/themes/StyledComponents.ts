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
export const DropdownItemContainer = styled.div<any>`
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
  ${(props) =>
    props.expanded
      ? css`
          max-height: 220px;
          opacity: 1;
        `
      : css`
          max-height: 0px;
          opacity: 0;
        `}
`;

export const DropdownCommandContainer = styled(DropdownItemContainer)`
  padding: 20px;
  background-color: #2f3640;
  transition: 500ms;
  :hover {
    cursor: pointer;
  }
`;
