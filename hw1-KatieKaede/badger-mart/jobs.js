function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!

    // get the radio elements
    const currentJob = document.getElementsByName('job');
    let selectedJob = '';

    // iterate through the list to find the checked job
    for (const job of currentJob) {
        if (job.checked) {
            selectedJob = job.value;
            break;
        }
    }

    if (selectedJob) {
        alert(`Thank you for applying to be a ${selectedJob}!`);
    } else {
        alert("Please select a job!");
    }
}