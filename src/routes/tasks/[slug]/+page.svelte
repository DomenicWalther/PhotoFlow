<script lang="ts">
	import type { PageData } from './$types';
    import { getUser } from "@lucia-auth/sveltekit/client";

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	export let data: PageData;

    const user = getUser()

    let comment: String;

    const submitComment = async (event) => {
        console.log(comment)
        fetch('/api/addCommentToTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: $user?.userId,
                task_id: data.tasks?.task_id,
                comment: comment
            })
        }).then((response) => {
			response.json();
		});
    }
</script>

<p />

<div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Client Information</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Task details</p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Client Name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.tasks?.task.charAt(0).toUpperCase() + data.tasks?.task.slice(1)}</dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Category</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.tasks?.additional_information}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Status</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.tasks?.status}</dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Due At</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data.tasks?.dueAt.toLocaleDateString('de-DE', dateOptions)}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div class="max-w-lg ">
                <form on:submit|preventDefault={submitComment} class="w-full p-4">
                    <label class="block mb-2">
                        <span class="text-gray-600">Add a comment</span>
                        <textarea class="block w-full mt-1 rounded" rows="3" bind:value={comment}/>
                    </label>
                    <button class="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded">Comment</button>
                </form>
            </div>
        </div>
      </dl>
    </div>
  </div>
  
