// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract TrainingValidate {
    struct StudentInfo {
        uint256 index;
        string major;
        string gradYear;
        string name;
    }

    mapping(address => StudentInfo) students;
    mapping(address => StudentInfo) thirdPartyStudents;

    address[] userIndex;

    function isUser(address _address) public view returns (bool) {
        return true;
    }
}
