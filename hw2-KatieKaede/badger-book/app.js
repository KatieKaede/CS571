let studentData = [];

fetch('https://cs571api.cs.wisc.edu/rest/f24/hw2/students', {
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})

.then(res => {
    console.log(res.status, res.statusText);
    if(res.status === 200) {
        return res.json();
    } else {
        throw new Error();
    }
})
.then(data => {

	const resultNumber = document.getElementById('num-results');
	if (resultNumber) {
		resultNumber.innerText = `${data.length}`;
	}

	// save the data in an array for search
	studentData = data;
    buildStudents(studentData);
})


// Function to dynamically build student elements on the page
function buildStudents(studs) {
    const studsContainer = document.getElementById('students'); // Assuming there's a container div with this ID

    studs.forEach(student => {

        const studsDiv = document.createElement('div');

		//Bootsrap column sizing
		studsDiv.className = 'col-12 col-md-6 col-lg-4 col-xl-3';

        // Name info
        const nameInfo = document.createElement('p');
        nameInfo.innerText = `${student.name.first} ${student.name.last}`;
		nameInfo.style.fontSize = '24px';
        studsDiv.appendChild(nameInfo);

		// Major Info
		const majorInfo = document.createElement('p');
		majorInfo.innerText = `Major: ${student.major}`;
		studsDiv.appendChild(majorInfo);

		// Credit Info
		const creditInfo = document.createElement('p');
		creditInfo.innerText = `Credits: ${student.numCredits}`;
		studsDiv.appendChild(creditInfo);

		// From Wisconsin
		const fromWisc = document.createElement('p');
		if (`${student.fromWisconsin}`) {
			fromWisc.innerText = "They are from Wisconsin";
		} else {
			fromWisc.innerText = "They are not from Wisconsin";
		}
		studsDiv.appendChild(fromWisc);

		// Interest Info
		const interestInfo = document.createElement('ul');
		interestInfo.style.paddingLeft = '0'; // Removes left padding
		interestInfo.style.marginLeft = '0';  // Removes left margin
		interestInfo.innerText = 'Interests:';
		
		student.interests.forEach(interest => {
			const specificInterest = document.createElement('li')
			specificInterest.innerText = interest;
			interestInfo.appendChild(specificInterest);

		// Taken from README.md
            specificInterest.addEventListener('click', (e) => {
                const selectedInterest = e.target.innerText;
                
				// Only focus on interest while clearing other values
                document.getElementById('search-name').value = '';
                document.getElementById('search-major').value = '';
                document.getElementById('search-interest').value = selectedInterest;

                handleSearch();
            });
            interestInfo.appendChild(specificInterest);
		});
		studsDiv.appendChild(interestInfo);

        // Append all info from the div to the container
        studsContainer.appendChild(studsDiv);
    });
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// Create new constants for search input
	const nameInput = document.getElementById('search-name').value;
    const majorInput = document.getElementById('search-major').value;
    const interestInput = document.getElementById('search-interest').value;

	
	const resultsFiltered = studentData.filter(student => {
		const firstLast = `${student.name.first} ${student.name.last}`.toLowerCase();
		const major = student.major.toLowerCase();

		// Account for if there's nothing put in a search bar
		const matchesName = nameInput === '' || firstLast.includes((nameInput).toLowerCase());
        const matchesMajor = majorInput === '' || major.includes((majorInput).toLowerCase());
        const matchesInterest = interestInput === '' || student.interests.some(interest => {
			return interest.toLowerCase().includes(interestInput.toLowerCase());
		});

		return matchesName && matchesMajor && matchesInterest;
	});

	const resultNumber = document.getElementById('num-results');
    if (resultNumber) {
        resultNumber.innerText = `${resultsFiltered.length}`;
    }

    // Clear display replace with filter
    const studentsContainer = document.getElementById('students');
    studentsContainer.innerHTML = '';
    buildStudents(resultsFiltered);
}

document.getElementById("search-btn").addEventListener("click", handleSearch);