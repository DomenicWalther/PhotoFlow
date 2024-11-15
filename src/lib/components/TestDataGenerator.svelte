<script lang="ts">

    import { tasks } from '$lib/Stores/TaskStore';

    import toast from 'svelte-french-toast';

    import { io } from '$lib/realtime';



    // Definiere Muster mit unterschiedlichen Häufigkeiten

    const commonPatterns = [

        // Sehr häufige Muster (hohe Konfidenz)

        { persons: 2, material: 'Leinwand', avgDays: 3, frequency: 20 },  // 20 Vorkommen -> ~100% Konfidenz

        { persons: 1, material: '', avgDays: 2, frequency: 15 },          // 15 Vorkommen -> ~75% Konfidenz

        

        // Mittelhäufige Muster (mittlere Konfidenz)

        { persons: 3, material: 'Platte', avgDays: 4, frequency: 8 },     // 8 Vorkommen -> ~40% Konfidenz

        { persons: 2, material: 'Platte', avgDays: 3, frequency: 6 },     // 6 Vorkommen -> ~30% Konfidenz

        

        // Seltene Muster (niedrige Konfidenz)

        { persons: 4, material: 'Leinenstruktur', avgDays: 5, frequency: 3 }, // 3 Vorkommen -> ~15% Konfidenz

        { persons: 5, material: 'Leinwand', avgDays: 6, frequency: 2 }        // 2 Vorkommen -> ~10% Konfidenz

    ];



    const statuses = ['NichtBearbeitet', 'Entwickelt', 'Retuschiert', 'Gedruckt'];

    

    function generateRandomTask(index: number, isPastTask = false, pattern = null) {

        const taskPattern = pattern || commonPatterns[Math.floor(Math.random() * commonPatterns.length)];

        const status = isPastTask ? 'Gedruckt' : statuses[Math.floor(Math.random() * statuses.length)];

        const isFinished = isPastTask;

        

        let dueAt: Date;

        let created_at: Date;

        if (isPastTask) {

            dueAt = new Date();

            dueAt.setDate(dueAt.getDate() - Math.floor(Math.random() * 180));

            created_at = new Date(dueAt);

            created_at.setDate(created_at.getDate() - (7 + Math.floor(Math.random() * 3)));

        } else {

            dueAt = new Date();

            dueAt.setDate(dueAt.getDate() + Math.floor(Math.random() * 30));

            created_at = new Date();

        }

        

        return {

            id: index + 1,

            name: `Familie Mustermann ${index + 1}`,

            dueAt,

            created_at,

            status,

            additional_information: `${taskPattern.persons} Pers${taskPattern.material ? `, ${taskPattern.material}` : ''}`,

            is_finished: isFinished,

            taskColumn: '1',

            orderPath: ''

        };

    }



    async function generateTestData() {

        try {

            let allTasks = [];

            let taskIndex = 0;



            // Generiere historische Tasks basierend auf den definierten Häufigkeiten

            for (const pattern of commonPatterns) {

                // Erstelle die angegebene Anzahl von historischen Tasks für jedes Muster

                const historicalTasks = Array.from({ length: pattern.frequency }, (_, i) => 

                    generateRandomTask(taskIndex++, true, pattern)

                );

                allTasks = [...allTasks, ...historicalTasks];

            }



            // Generiere einige aktuelle/zukünftige Tasks

            // Verwende dabei die gleichen Muster, aber in geringerer Anzahl

            for (const pattern of commonPatterns) {

                const futureTasks = Array.from({ length: Math.max(1, Math.floor(pattern.frequency / 5)) }, (_, i) => 

                    generateRandomTask(taskIndex++, false, pattern)

                );

                allTasks = [...allTasks, ...futureTasks];

            }



            const response = await fetch('/api/importTestData', {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ tasks: allTasks })

            });



            if (response.ok) {

                tasks.set(allTasks);

                toast.success(`${allTasks.length} Testdaten erfolgreich generiert!`);

                io.emit('database-change');

            } else {

                throw new Error('Fehler beim Generieren der Testdaten');

            }

        } catch (error) {

            toast.error('Fehler beim Generieren der Testdaten');

            console.error(error);

        }

    }

</script>



<button

    on:click={generateTestData}

    class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2"

>

    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">

        <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />

    </svg>

    Realistische Testdaten generieren

</button> 




