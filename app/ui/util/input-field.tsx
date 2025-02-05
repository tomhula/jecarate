export default function InputField(props: { type: string, placeholder: string, required: boolean, minLength: number })
{
    return (
        <input
            className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-6 py-4 text-xl text-gray-900 placeholder-gray-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-700"
            type={props.type}
            placeholder={props.placeholder}
            required={props.required}
            minLength={props.minLength ?? 0}
        />
    );
}