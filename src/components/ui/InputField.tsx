import type { FC } from "react"

import { Text, TextInput, View } from "react-native"

import { tw } from "~/helpers"

type Props = {
	prefix?: string
	placeholder: string
	value: string | null
	error: string | null
	secureTextEntry?: boolean
	autoCorrect?: boolean
	keyboardType?:
		| "default"
		| "number-pad"
		| "decimal-pad"
		| "numeric"
		| "email-address"
		| "phone-pad"
		| "url"
	onChangeText: (text: string) => void
}

const InputField = ({
	prefix,
	placeholder,
	value,
	error,
	onChangeText,
	secureTextEntry,
	autoCorrect,
	keyboardType,
}: Props) => {
	const styles = {
		body: tw`bg-outline flex h-20 w-full flex-row items-center justify-start gap-2 rounded-xl border border-gray-200 bg-white px-4 shadow-md`,
	}

	return (
		<View className={styles.body}>
			{prefix && <Text className="text-lg font-bold">{prefix}</Text>}

			<TextInput
				value={value!}
				style={{ flex: 1, marginLeft: 10, fontSize: 18 }}
				placeholder={placeholder}
				keyboardType={keyboardType}
				secureTextEntry={secureTextEntry}
				autoCorrect={autoCorrect}
				onChangeText={onChangeText}
			/>

			{error && <Text>⛔️🙅‍♂️</Text>}
			{error && (
				<View className="absolute -bottom-6 left-3 flex flex-row items-center justify-center ">
					<Text className="text-sm font-light text-red-500">🗣</Text>
					<Text className="mt-1 text-sm font-light text-red-500">
						{typeof error === "string" ? error : "🤷‍♂️"}
					</Text>
				</View>
			)}
		</View>
	)
}
type InputFieldProps = {
	value: string | null
	error: string | null
	onChangeText: (text: string) => void
}
const EmailInputField: FC<InputFieldProps> = (props) => {
	return (
		<InputField
			{...props}
			prefix="📧"
			placeholder="Email"
			keyboardType="email-address"
		/>
	)
}

const PasswordInputField: FC<InputFieldProps> = (props) => {
	return (
		<InputField
			{...props}
			prefix="🔒"
			placeholder="Password"
			secureTextEntry
		/>
	)
}

const NameInputField: FC<InputFieldProps> = (props) => {
	return (
		<InputField
			{...props}
			prefix="🥸"
			placeholder="Name"
			keyboardType="default"
		/>
	)
}

export default InputField
export { EmailInputField, PasswordInputField, NameInputField }
