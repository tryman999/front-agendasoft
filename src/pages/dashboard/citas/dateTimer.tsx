/* eslint-disable @typescript-eslint/no-explicit-any */
export const DateTimer = ({
  selectedTime,
  setSelectedTime,
  handleShowSelectTimer,
  citas,
  fechaInicioFormateada,
}: {
  fechaInicioFormateada: any;
  citas: any;
  selectedTime: any;
  setSelectedTime: any;
  handleShowSelectTimer: any;
}) => {
  // State to hold the currently selected time

  // Function to generate time options from 08:00 to 18:00 in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM (18:00 in 24-hour format)

    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += 60) {
        // Skip times after 18:00 (e.g., 18:30 should not be included)
        if (h === endHour && m > 0) {
          continue;
        }

        const hour24 = h.toString().padStart(2, "0"); // e.g., '08', '13'
        const minute = m.toString().padStart(2, "0"); // e.g., '00', '30'
        const timeValue = `${hour24}:${minute}`; // Value for the input (e.g., '08:00', '13:30')

        // For display: Convert to AM/PM format (optional, you can keep 24hr if preferred)
        let displayHour = h;
        let ampm = "AM";
        if (h >= 12) {
          ampm = "PM";
          if (h > 12) {
            displayHour = h - 12;
          }
        }
        if (h === 0) {
          // For midnight (00:00) if you were including it
          displayHour = 12;
        }
        const displayTime = `${displayHour
          .toString()
          .padStart(2, "0")}:${minute} ${ampm}`;

        slots.push({
          value: timeValue,
          display: displayTime,
          id: timeValue.replace(":", "-"), // Unique ID for input and label
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Function to handle changes in the selected radio button
  const handleTimeChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    if (citas.length > 0) {
      const myfechaFormateada = fechaInicioFormateada.split(" ")[0];
      let save = true;
      const myfecha = Number(event.target.value.toString().split(":")[0]);

      citas.forEach((element: any) => {
        const dateCita = new Date(element.fecha_inicio).getHours();
        const mydays = element.fecha_inicio.split("T")[0];
        if (dateCita === myfecha && myfechaFormateada === mydays) {
          alert(
            `Esta Hora y Fecha ya se encuentra ocupada seleccione otra diferente a esta 
          ${fechaInicioFormateada}.`
          );
          save = false;
        }
      });
      if (save) setSelectedTime(event.target.value);
      handleShowSelectTimer();
    }

    setSelectedTime(event.target.value);
    handleShowSelectTimer();
  };

  return (
    <>
      <div className="pt-5 border-t flex sm:flex-row flex-col sm:space-x-5 rtl:space-x-reverse">
        <ul id="timetable" className="grid w-full grid-cols-2 gap-2 mt-5">
          {timeSlots.map((slot: any) => {
            if (slot.id !== "12-00") {
              return (
                <li key={slot.id}>
                  {" "}
                  {/* Use key for React list rendering */}
                  <input
                    type="radio"
                    id={slot.id}
                    value={slot.value} // The actual time string like "08:00"
                    className="hidden peer"
                    name="timetable" // All radio buttons in this group should have the same name
                    checked={selectedTime === slot.value} // Check if this time is selected
                    onChange={handleTimeChange} // Handle selection change
                  />
                  <label
                    htmlFor={slot.id}
                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white dark:peer-checked:text-white hover:bg-blue-500"
                  >
                    {slot.display}{" "}
                    {/* The human-readable time like "08:00 AM" */}
                  </label>
                </li>
              );
            }
            return <></>;
          })}
        </ul>
      </div>
      {/* Optional: Display the selected time for debugging or confirmation */}
    </>
  );
};
