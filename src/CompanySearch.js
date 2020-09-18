import React from "react";
import CompanyOperations from "./integration/CompanyOperations";
import UserOperations from "./integration/UserOperations";
import './index.css'
import MaterialUnderlineTextbox from "./components/MaterialUnderlineTextbox";
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
        if (userCompanyName.value !== null && userCompanyName.value !== "" && userCompanyName.value !== undefined &&
            cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && cellNumber.value.length >= 10 &&
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
            cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && cellNumber.value.length >= 10 &&
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
        if (cellNumber.value !== null && cellNumber.value !== "" && cellNumber.value !== undefined && cellNumber.value.length >= 10 &&
            videoNameWatched.value !== null && videoNameWatched.value !== "" && videoNameWatched.value !== undefined) {
            this.togglePopOff();
            WatchedOperations.removeWatched(cellNumber.value, videoNameWatched.value).then(value => {
                let responseCellNumber = cellNumber.value;
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
                <div className="UserOpsRow">
                    <div className="UserOps">
                        <div className="UserOperationsUI">User Operations</div>
                        <MaterialUnderlineTextbox
                            id="userCompanyName"
                            style={{
                                height: 43,
                                width: '44.165%',
                                marginTop: 24,
                                marginLeft: 13,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Company Name"
                        />
                        <MaterialUnderlineTextbox
                            id="cellNumberUser"
                            style={{
                                height: 43,
                                width: '44.165%',
                                marginTop: 17,
                                marginLeft: 13,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Cell Number"
                        />
                        <div className="NewCellNumberRow">
                            <MaterialUnderlineTextbox
                                id="registeredCourses"
                                style={{
                                    height: '100%',
                                    width: '48%',
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Registered Courses"
                            />
                            <MaterialUnderlineTextbox
                                id="additionalCourses"
                                style={{
                                    height: '100%',
                                    width: '48%',
                                    marginLeft: 10,
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Additional Courses"
                            />
                        </div>

                        <div className="MaterialButtonSuccess2Row">
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{
                                    height: 36,
                                    width: '80%',
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
                                    width: '80%',
                                    marginLeft: 20,
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
                                    width: '80%',
                                    marginLeft: 20,
                                    fontSize: '11px'
                                }}
                                startIcon={<DeleteIcon/>}
                                size={"small"}
                                onClick={this.removeUser}
                            >Remove User</Button>
                        </div>
                    </div>
                    <div className="WatchedOps">
                        <div className="WatchedOperationsUI">Watched Operations</div>
                        <MaterialUnderlineTextbox
                            id="cellNumber"
                            style={{
                                height: 43,
                                width: '80%',
                                marginTop: 84,
                                marginLeft: 24,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Cell Number"
                        />
                        <MaterialUnderlineTextbox
                            id="videoNameWatched"
                            style={{
                                height: 43,
                                width: '80%',
                                marginTop: 14,
                                marginLeft: 24,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Video Name"
                        />
                        <Button
                            variant="outlined"
                            color="secondary"
                            style={{
                                height: 36,
                                width: '80%',
                                marginTop: 29,
                                marginLeft: 24,
                                fontSize: '11px'
                            }}
                            startIcon={<DeleteIcon/>}
                            size={"small"}
                            onClick={this.removeWatched}
                        >Remove Watched Video</Button>
                    </div>
                    <div className="VidsOps">
                        <div className="VideoOperationsUI">Video Operations</div>
                        <MaterialUnderlineTextbox
                            id="courseName"
                            style={{
                                height: 43,
                                width: '80%',
                                marginTop: 24,
                                marginLeft: 25,
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            inputStyle="Course Name"
                        />
                        <div className="VideoNameVideoRow">
                            <MaterialUnderlineTextbox
                                id="videoNameVideo"
                                style={{
                                    height: 43,
                                    width: '35%',
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Video Name"
                            />
                            <div>
                                <input
                                    id="contained-button-video"
                                    type="file"
                                    onChange={this.onFileChangeVideo}
                                    style={{
                                        width: '85.5%',
                                        border: "1px",
                                        borderColor: "rgba(103, 128, 159, 0.5)",
                                        borderStyle: "solid"
                                    }}
                                />
                            </div>
                        </div>
                        <div className="VideoPdfRow">
                            <MaterialUnderlineTextbox
                                id="pdfName"
                                style={{
                                    height: 43,
                                    width: '35%',
                                    border: "1px",
                                    borderColor: "rgba(103, 128, 159, 0.5)",
                                    borderStyle: "solid"
                                }}
                                inputStyle="Pdf Name"
                            />
                            <div>
                                <input
                                    id="contained-button-file"
                                    type="file"
                                    onChange={this.onFileChangePdf}
                                    style={{
                                        width: '85.5%',
                                        border: "1px",
                                        borderColor: "rgba(103, 128, 159, 0.5)",
                                        borderStyle: "solid"
                                    }}
                                />
                            </div>
                        </div>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{
                                height: 36,
                                width: '80%',
                                marginTop: 29,
                                marginLeft: 25,
                                fontSize: '11px'
                            }}
                            endIcon={<Send/>}
                            size={"small"}
                            onClick={this.onFileUpload}
                        >Add Video And PDF</Button>
                    </div>
                </div>
                <div className="SearchBarRow">
                    <div className="InputStyleStack">
                        <input id="compSearch" className="prompt" type="text" placeholder="Company Name"
                               value={this.state.searchValue}
                               onChange={this.handleSearchChange}
                               style={{
                                   marginTop: -380,
                                   marginLeft: -20.5,
                                   font: 'Roboto',
                                   height: '48px',
                                   color: '#000',
                                   width: '87%',
                                   position: 'absolute',
                                   background: 'transparent',
                                   border: "1px",
                                   borderColor: "rgba(103, 128, 159, 0.5)",
                                   borderStyle: "solid"
                               }}
                        />
                    </div>
                    <div className="InputStyleStack">
                        <Button
                            color="primary"
                            style={{
                                marginTop: -380,
                                marginLeft: -40,
                                font: 'Roboto',
                                height: 52,
                                width: '88.075%',
                                position: 'absolute',
                                border: "1px",
                                borderColor: "rgba(103, 128, 159, 0.5)",
                                borderStyle: "solid"
                            }}
                            endIcon={<SaveAlt/>}
                            size={"small"}
                            onClick={this.printDocument}
                        >Generate PDF Report</Button>
                    </div>
                </div>
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

export default CompanySearch;