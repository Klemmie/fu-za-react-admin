import React from "react";
import CompanyOperations from "./integration/CompanyOperations";
import UserOperations from "./integration/UserOperations";
import './index.css'
import Cell from "./Cell";
import MaterialUnderlineTextbox from "./components/MaterialUnderlineTextbox";
import styled from "styled-components";
import {Button} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import Send from '@material-ui/icons/Send';
import WatchedOperations from "./integration/WatchedOperations";
import VideoOperations from "./integration/VideoOperations";

class CompanySearch extends React.Component {
    state = {
        content: [],
        headings: [],
        searchValue: "",
        selectedVideo: null,
        selectedPdf: null,
        pdfReport: []
    };

    onFileChangeVideo = event => {
        this.setState({selectedVideo: event.target.files[0]});
    };

    onFileChangePdf = event => {
        this.setState({selectedPdf: event.target.files[0]});
    };


    onFileUpload = () => {
        const formDataVideo = new FormData();
        const formDataPdf = new FormData();

        let course = document.getElementById("courseName1").value;
        let vidName = document.getElementById("videoNameVideo1").value;
        let pdfName = document.getElementById("pdfName1").value;

        console.log(course);
        console.log(vidName);
        console.log(pdfName);

        formDataVideo.append(
            'file',
            this.state.selectedVideo
        );

        formDataPdf.append(
            'file',
            this.state.selectedPdf
        );

        console.log(this.state.selectedVideo);
        console.log(this.state.selectedPdf);

        VideoOperations.addVideo(course, formDataVideo, vidName);
        VideoOperations.addPdf(course, formDataPdf, pdfName);
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
        let userCompanyName = document.getElementById("userCompanyName1").value;
        let registeredCourses = document.getElementById("registeredCourses1").value;
        let cellNumber = document.getElementById("cellNumberUser1").value;
        UserOperations.addUser(userCompanyName, cellNumber, registeredCourses);
    }

    updateUser = () => {
        let userCompanyName = document.getElementById("userCompanyName1").value;
        let cellNumber = document.getElementById("cellNumberUser1").value;
        let additionalCourses = document.getElementById("additionalCourses1").value;
        UserOperations.updateUser(userCompanyName, cellNumber, additionalCourses);
    }

    removeUser = () => {
        let cellNumber = document.getElementById("cellNumberUser1").value;
        UserOperations.removeUser(cellNumber);
    }

    removeWatched = () => {
        let cellNumber = document.getElementById("cellNumber1").value;
        let videoNameWatched = document.getElementById("videoNameWatched1").value;
        WatchedOperations.removeWatched(cellNumber, videoNameWatched);
    }

    getWatchedReport = () => {
        WatchedOperations.getWatchedReport(this.state.searchValue, content => {
            this.setState({
                pdfReport: content.slice(0, 25)
            });
        });
    }

    render() {
        const {content} = this.state;
        const headings = [
            'Company name',
            'Cell number',
            'Course',
            'Video Name',
            'Watched',
            'Date'
        ];

        const contRows = content.map((cont, idx) => (
            <tr key={idx}>
                <Cell key={`${idx}-${1}`} content={cont.companyName} fixed={1 === 0} height={5}/>
                <Cell key={`${idx}-${2}`} content={cont.cellNumber} fixed={2 === 0} height={5}/>
                <Cell key={`${idx}-${3}`} content={cont.course} fixed={3 === 0} height={5}/>
                <Cell key={`${idx}-${4}`} content={cont.videoName} fixed={4 === 0} height={5}/>
                <Cell key={`${idx}-${5}`} content={cont.watched} fixed={5 === 0} height={5}/>
                <Cell key={`${idx}-${6}`} content={cont.date} fixed={6 === 0} height={5}/>
            </tr>
        ));

        const theadMarkup = (
            <tr key="heading">
                <Cell key={`${1}`} content={headings[0]} header={true} fixed={1 === 0} height={5}/>
                <Cell key={`${2}`} content={headings[1]} header={true} fixed={2 === 0} height={5}/>
                <Cell key={`${3}`} content={headings[2]} header={true} fixed={3 === 0} height={5}/>
                <Cell key={`${4}`} content={headings[3]} header={true} fixed={4 === 0} height={5}/>
                <Cell key={`${5}`} content={headings[4]} header={true} fixed={5 === 0} height={5}/>
                <Cell key={`${6}`} content={headings[5]} header={true} fixed={6 === 0} height={5}/>
            </tr>
        );

        return (
            <>
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
                <InputStyleStack>
                    <input className="prompt" type="text" placeholder="Company Name"
                           value={this.state.searchValue}
                           onChange={this.handleSearchChange}
                           style={{
                               marginTop: -380, marginLeft: 130, font: 'Roboto', height: '48px', color: '#000',
                               width: '257px', position: 'absolute', left: '0px', top: '0px', background: 'transparent',
                               border: "1px", borderColor: "rgba(103, 128, 159, 0.5)", borderStyle: "solid"
                           }}
                    />
                </InputStyleStack>
                <div id="company-name" className="DataTable">
                    <div className="ScrollContainer">
                        <table className="Table">
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

const MaterialButtonSuccess2Row = styled.div`
  height: 36px;
  flex-direction: row;
  display: flex;
  margin-top: 29px;
  margin-left: 18px;
  margin-right: 18px;
`;

export default CompanySearch;