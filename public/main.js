document.getElementById('floor-wing-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const floor = document.getElementById('floor').value;
  const wing = document.getElementById('wing').value;
  const patientListDiv = document.getElementById('patientsList'); 

  try {
    
    const response = await fetch(`/patients?floor=${floor}&wing=${wing}`);
    const data = await response.json();

  
    patientListDiv.innerHTML = '';

    if (data.length > 0) {
      data.forEach((patient) => {
        const li = document.createElement('li');
        li.className = 'patientList';
        li.innerHTML = `
          <strong>Name:</strong> ${patient.name} 
          <strong>Age:</strong> ${patient.age} 
          <strong>Floor:</strong> ${patient.floor} 
          <strong>Wing:</strong> ${patient.wing} 
          <strong>Room:</strong> ${patient.roomNumber}
        `;
        patientListDiv.appendChild(li);
      });
    } else {
      // Show no patients message
      patientListDiv.innerHTML = '<p>No patients found for the selected floor and wing.</p>';
    }
  } catch (error) {
    console.error('Error fetching patients:', error);
    patientListDiv.innerHTML = '<p>Error fetching patient data. Please try again later.</p>';
  }
});

document.getElementById('patientActivityForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    breakfast: formData.get('breakfast'),
    lunch: formData.get('lunch'),
    dinner: formData.get('dinner'),
    changed: formData.get('changed'),
    abrasions: formData.get('abrasions')
  };

  try {
    const response = await fetch('/patient-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
      alert(`Summary: ${JSON.stringify(result.summary)}`);
    } else {
      const error = await response.json();
      alert(error.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit data');
  }
});
// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
