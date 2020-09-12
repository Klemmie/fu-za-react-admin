import React from "react";
import CompanyOperations from "./integration/CompanyOperations";
import UserOperations from "./integration/UserOperations";
import './index.css'
import MaterialUnderlineTextbox from "./components/MaterialUnderlineTextbox";
import styled from "styled-components";
import {Button} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import Send from '@material-ui/icons/Send';
import SaveAlt from '@material-ui/icons/SaveAlt'
import WatchedOperations from "./integration/WatchedOperations";
import TableRow from "@material-ui/core/TableRow";
import jsPDF from 'jspdf';
import TableCell from "@material-ui/core/TableCell";
import "jspdf-autotable"
import PopUpValidation from "./PopUpValidation";
import PopUpSuccess from "./PopUpSuccess";
import UploadProgress from "./UploadProgress";
import VideoOperations from "./integration/VideoOperations";

class CompanySearch extends React.Component {
    state = {
        content: [],
        headings: [],
        searchValue: "",
        selectedVideo: null,
        selectedPdf: null,
        pdfReport: [],
        seen: false,
        seenSuccess: false,
        progress: false
    };

    togglePopOn = () => {
        this.setState({
            seen: true
        });
    };

    togglePopOff = () => {
        this.setState({
            seen: false
        });
    };

    togglePopSuccessOn = () => {
        this.setState({
            seenSuccess: true
        });
        setTimeout(() =>
            this.setState({
                seenSuccess: false,
                progress: false
            }), 5000);
    };

    togglePopSuccessOff = () => {
        this.setState({
            seenSuccess: false
        });
    };

    onFileChangeVideo = event => {
        this.setState({selectedVideo: event.target.files[0]});
    };

    onFileChangePdf = event => {
        this.setState({selectedPdf: event.target.files[0]});
    };


    onFileUpload = () => {
        this.setState({
            progress: true
        })
        const formDataVideo = new FormData();
        const formDataPdf = new FormData();

        let course = document.getElementById("courseName1").value;
        let vidName = document.getElementById("videoNameVideo1").value;
        let pdfName = document.getElementById("pdfName1").value;

        if (course.value !== null && course.value !== "" &&
            vidName.value !== null && vidName.value !== "" &&
            this.state.selectedVideo !== null && this.state.selectedPdf !== null &&
            pdfName.value !== null && pdfName.value !== "") {
            this.togglePopOff()
            formDataVideo.append(
                'file',
                this.state.selectedVideo
            );

            formDataPdf.append(
                'file',
                this.state.selectedPdf
            );

            VideoOperations.addVideo(course, formDataVideo, vidName).then(value => {
                if (value.name === pdfName) {
                    this.togglePopSuccessOn();
                }
            });
            VideoOperations.addPdf(course, formDataPdf, pdfName)

        } else
            this.togglePopOn();
    };

    handleSearchChange = e => {
        const value = e.target.value;

        this.setState({
            searchValue: value
        });

        if (value === "") {
            this.setState({
                content: []
            })
        } else {
            CompanyOperations.learnersByCompanyName(value, content => {
                this.setState({
                    content: content.slice(0, 25)
                });
            });
        }
    };

    addUser = () => {
        let userCompanyName = document.getElementById("userCompanyName1");
        let registeredCourses = document.getElementById("registeredCourses1");
        let cellNumber = document.getElementById("cellNumberUser1");
        console.log(userCompanyName);
        console.log(registeredCourses);
        console.log(cellNumber);
        if (userCompanyName.value !== null && userCompanyName.value !== "" && userCompanyName.value !== undefined &&
            cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && !cellNumber.value.length < 10 &&
            registeredCourses.value !== null && registeredCourses.value !== "" && registeredCourses.value !== undefined) {
            this.togglePopOff();
            UserOperations.addUser(userCompanyName.value, cellNumber.value, registeredCourses.value)
                .then(value => {
                    let responseCellNumber = "27" + cellNumber.value;
                    if (value.cellNumber === responseCellNumber)
                        this.togglePopSuccessOn();
                });
        } else
            this.togglePopOn()
    }

    updateUser = () => {
        let userCompanyName = document.getElementById("userCompanyName1");
        let cellNumber = document.getElementById("cellNumberUser1");
        let additionalCourses = document.getElementById("additionalCourses1");
        if (userCompanyName.value !== null && userCompanyName.value !== "" && userCompanyName.value !== undefined &&
            cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && cellNumber.value.length < 10 &&
            additionalCourses.value !== null && additionalCourses.value !== "" && additionalCourses.value !== undefined) {
            this.togglePopOff();
            UserOperations.updateUser(userCompanyName.value, cellNumber.value, additionalCourses.value)
                .then(value => {
                    let responseCellNumber = "27" + cellNumber.value;
                    if (value.cellNumber === responseCellNumber)
                        this.togglePopSuccessOn();
                });
        } else
            this.togglePopOn()
    }

    removeUser = () => {
        let cellNumber = document.getElementById("cellNumberUser1");
        if (cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && cellNumber.value.length < 10) {
            this.togglePopOff();
            UserOperations.removeUser(cellNumber.value).then(value => {
                let responseCellNumber = "27" + cellNumber.value;
                if (value.cellNumber === responseCellNumber)
                    this.togglePopSuccessOn();
            });
        } else
            this.togglePopOn()
    }

    removeWatched = () => {
        let cellNumber = document.getElementById("cellNumber1");
        let videoNameWatched = document.getElementById("videoNameWatched1");
        if (cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && cellNumber.value.length < 10 &&
            videoNameWatched.value !== null && videoNameWatched.value !== "" && videoNameWatched.value !== undefined) {
            this.togglePopOff();
            WatchedOperations.removeWatched(cellNumber.value, videoNameWatched.value).then(value => {
                let responseCellNumber = "27" + cellNumber.value;
                if (value.cellNumber === responseCellNumber)
                    this.togglePopSuccessOn();
            });
        } else
            this.togglePopOn()
    }

    printDocument = () => {
        let searchBar = document.getElementById("compSearch");
        if (searchBar.value !== null && searchBar.value !== "") {
            this.togglePopOff();
            let content = document.getElementById("companyTable");
            let doc = new jsPDF('p', 'pt', 'a4')
            doc.autoTable({html: content})

            doc.save(this.state.searchValue);
            this.togglePopSuccessOn();
        } else {
            this.togglePopOn()
        }
    };

    render() {
        const {content} = this.state;

        const contRows = content.map((cont, idx) => (
            <TableRow key={idx}>
                <TableCell align="left">{cont.companyName}</TableCell>
                <TableCell align="left">{cont.cellNumber}</TableCell>
                <TableCell align="left">{cont.course}</TableCell>
                <TableCell align="left">{cont.videoName}</TableCell>
                <TableCell align="left">{cont.watched}</TableCell>
                <TableCell align="left">{cont.date}</TableCell>
            </TableRow>
        ));

        const theadMarkup = (
            <TableRow key="heading">
                <TableCell align="left">Company name</TableCell>
                <TableCell align="left">Cell number</TableCell>
                <TableCell align="left">Course</TableCell>
                <TableCell align="left">Video Name</TableCell>
                <TableCell align="left">Watched</TableCell>
                <TableCell align="left">Date</TableCell>
            </TableRow>
        );

        return (
            <>
                <div>
                    {this.state.seen ? <PopUpValidation toggle={this.togglePopOff}/> : null}
                </div>
                <div>
                    {this.state.seenSuccess ? <PopUpSuccess toggle={this.togglePopSuccessOff}/> : null}
                </div>
                <div>
                    {this.state.progress ? <UploadProgress/> : null}
                </div>
                <UserOpsRow>
                    <UserOps>
                        <UserOperationsUI>User Operations</UserOperationsUI>
                        <MaterialUnderlineTextbox
                            id="userCompanyName"
                            style={{
                                height: 43,
                                width: 183,
                                marginTop: 24,
                                marginLeft: 26,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Company Name"
                        ></MaterialUnderlineTextbox>
                        <MaterialUnderlineTextbox
                            id="cellNumberUser"
                            style={{
                                height: 43,
                                width: 183,
                                marginTop: 17,
                                marginLeft: 26,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Cell Number"
                        ></MaterialUnderlineTextbox>
                        <NewCellNumberRow>
                            <MaterialUnderlineTextbox
                                id="registeredCourses"
                                style={{
                                    height: 43,
                                    width: 183,
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Registered Courses"
                            ></MaterialUnderlineTextbox>
                            <MaterialUnderlineTextbox
                                id="additionalCourses"
                                style={{
                                    height: 43,
                                    width: 183,
                                    marginLeft: 108,
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Additional Courses"
                            ></MaterialUnderlineTextbox>
                        </NewCellNumberRow>

                        <MaterialButtonSuccess2Row>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{
                                    height: 36,
                                    width: 200,
                                    fontSize: '11px'
                                }}
                                endIcon={<Send/>}
                                size={"small"}
                                onClick={this.addUser}
                            >Add User</Button>
                            <Button
                                variant="outlined"
                                color="default"
                                style={{
                                    height: 36,
                                    width: 200,
                                    marginLeft: 36,
                                    fontSize: '11px'
                                }}
                                startIcon={<CloudUploadIcon/>}
                                size={"small"}
                                onClick={this.updateUser}
                            >Update User</Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                style={{
                                    height: 36,
                                    width: 200,
                                    marginLeft: 39,
                                    fontSize: '11px'
                                }}
                                startIcon={<DeleteIcon/>}
                                size={"small"}
                                onClick={this.removeUser}
                            >Remove User</Button>
                        </MaterialButtonSuccess2Row>
                    </UserOps>
                    <WatchedOps>
                        <WatchedOperationsUI>Watched Operations</WatchedOperationsUI>
                        <MaterialUnderlineTextbox
                            id="cellNumber"
                            style={{
                                height: 43,
                                width: 360,
                                marginTop: 84,
                                marginLeft: 24,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Cell Number"
                        ></MaterialUnderlineTextbox>
                        <MaterialUnderlineTextbox
                            id="videoNameWatched"
                            style={{
                                height: 43,
                                width: 360,
                                marginTop: 14,
                                marginLeft: 24,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Video Name"
                        ></MaterialUnderlineTextbox>
                        <Button
                            variant="outlined"
                            color="secondary"
                            style={{
                                height: 36,
                                width: 247,
                                marginTop: 29,
                                marginLeft: 24,
                                fontSize: '11px'
                            }}
                            startIcon={<DeleteIcon/>}
                            size={"small"}
                            onClick={this.removeWatched}
                        >Remove Watched Video</Button>
                    </WatchedOps>
                    <VidsOps>
                        <VideoOperationsUI>Video Operations</VideoOperationsUI>
                        <MaterialUnderlineTextbox
                            id="courseName"
                            style={{
                                height: 43,
                                width: 467,
                                marginTop: 24,
                                marginLeft: 25,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Course Name"
                        ></MaterialUnderlineTextbox>
                        <VideoNameVideoRow>
                            <MaterialUnderlineTextbox
                                id="videoNameVideo"
                                style={{
                                    height: 43,
                                    width: 220,
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Video Name"
                            ></MaterialUnderlineTextbox>
                            <div>
                                <input
                                    id="contained-button-video"
                                    type="file"
                                    onChange={this.onFileChangeVideo}
                                    style={{
                                        marginLeft: 44,
                                        width: 220,
                                        border: "1px",
                                        borderColor: "rgba(103, 128, 159, 0.5)",
                                        borderStyle: "solid"
                                    }}
                                />
                            </div>
                        </VideoNameVideoRow>
                        <VideoPdfRow>
                            <MaterialUnderlineTextbox
                                id="pdfName"
                                style={{
                                    height: 43,
                                    width: 220,
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Pdf Name"
                            ></MaterialUnderlineTextbox>
                            <div>
                                <input
                                    id="contained-button-file"
                                    type="file"
                                    onChange={this.onFileChangePdf}
                                    style={{
                                        marginLeft: 44,
                                        width: 220,
                                        border: "1px",
                                        borderColor: "rgba(103, 128, 159, 0.5)",
                                        borderStyle: "solid"
                                    }}
                                />
                            </div>
                        </VideoPdfRow>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{
                                height: 36,
                                width: 247,
                                marginTop: 29,
                                marginLeft: 25,
                                fontSize: '11px'
                            }}
                            endIcon={<Send/>}
                            size={"small"}
                            onClick={this.onFileUpload}
                        >Add Video And PDF</Button>
                    </VidsOps>
                </UserOpsRow>
                <SearchBarRow>
                    <InputStyleStack>
                        <input id="compSearch" className="prompt" type="text" placeholder="Company Name"
                               value={this.state.searchValue}
                               onChange={this.handleSearchChange}
                               style={{
                                   marginTop: -380,
                                   marginLeft: 130,
                                   font: 'Roboto',
                                   height: '48px',
                                   color: '#000',
                                   width: '257px',
                                   position: 'absolute',
                                   left: '0px',
                                   top: '0px',
                                   background: 'transparent',
                                   border: "1px",
                                   borderColor: "rgba(103, 128, 159, 0.5)",
                                   borderStyle: "solid"
                               }}
                        />
                    </InputStyleStack>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{
                            marginTop: -377,
                            marginLeft: 160,
                            height: 36,
                            width: 200,
                            fontSize: '11px'
                        }}
                        endIcon={<SaveAlt/>}
                        size={"small"}
                        onClick={this.printDocument}
                    >Generate PDF Report</Button>
                </SearchBarRow>
                <div id="company-name" className="DataTable">
                    <div className="ScrollContainer">
                        <table id="companyTable" className="Table">
                            <thead>
                            {theadMarkup}
                            </thead>
                            <tbody>
                            {contRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }
}

const UserOps = styled.div`
  width: 518px;
  height: 292px;
  border-width: 1px;
  border-color: rgba(0,0,0,1);
  flex-direction: column;
  display: flex;
  border-style: solid;
`;

const UserOperationsUI = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  margin-top: 11px;
  margin-left: 209px;
`;

const NewCellNumberRow = styled.div`
  height: 43px;
  flex-direction: row;
  display: flex;
  margin-top: 14px;
  margin-left: 26px;
  margin-right: 18px;
`;

const WatchedOps = styled.div`
  width: 518px;
  height: 292px;
  border-width: 1px;
  border-color: rgba(0,0,0,1);
  flex-direction: column;
  display: flex;
  margin-left: 44px;
  border-style: solid;
`;

const WatchedOperationsUI = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  margin-top: 11px;
  margin-left: 196px;
`;

const VidsOps = styled.div`
  width: 518px;
  height: 292px;
  border-width: 1px;
  border-color: rgba(0,0,0,1);
  flex-direction: column;
  display: flex;
  margin-left: 40px;
  border-style: solid;
`;

const VideoOperationsUI = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  margin-top: 11px;
  margin-left: 205px;
`;

const VideoNameVideoRow = styled.div`
  height: 43px;
  flex-direction: row;
  display: flex;
  margin-top: 17px;
  margin-left: 25px;
  margin-right: 27px;
`;

const VideoPdfRow = styled.div`
  height: 43px;
  flex-direction: row;
  display: flex;
  margin-top: 14px;
  margin-left: 25px;
  margin-right: 27px;
`;

const UserOpsRow = styled.div`
  height: 292px;
  flex-direction: row;
  display: flex;
  margin-top: 138px;
  margin-left: 130px;
  margin-right: 152px;
`;

const InputStyleStack = styled.div`
  width: 290px;
  height: 49px;
  margin-left: 21px;
  margin-top: 4px;
  position: relative;
`;

const SearchBarRow = styled.div`
  height: 65px;
  flex-direction: row;
  display: flex;
  margin-top: 4px;
  margin-left: 130px;
`;

const MaterialButtonSuccess2Row = styled.div`
  height: 36px;
  flex-direction: row;
  display: flex;
  margin-top: 29px;
  margin-left: 18px;
  margin-right: 18px;
`;

export default CompanySearch;