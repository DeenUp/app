import type { FC, ReactNode } from "react"

import { Text, TextInput, View } from "react-native"

import { MaterialIcons } from "@expo/vector-icons"
import { twMerge } from "tailwind-merge"
import twr from "twrnc"

import { tw } from "~/helpers"

type Props = {
	icon?: ReactNode
	placeholder: string
	value: string | null
	error: string | null
	secureTextEntry?: boolean
	autoCorrect?: boolean
	className?: string
	testID?: string
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
	icon,
	placeholder,
	value,
	error,
	onChangeText,
	secureTextEntry,
	autoCorrect,
	keyboardType,
	className,
	testID,
}: Props) => {
	const styles = {
		body: tw`flex h-20 w-full flex-row items-center justify-start gap-2 rounded-full border-4 border-primary bg-transparent  px-4 shadow-md`,
	}

	const style = twr`${twMerge(className, tw`mb-2 ml-2 flex-1 text-lg `)}`

	return (
		<View className={styles.body}>
			{icon && <Text className="text-lg font-bold">{icon}</Text>}

			<TextInput
				testID={testID}
				value={value!}
				style={style}
				placeholder={placeholder}
				keyboardType={keyboardType}
				secureTextEntry={secureTextEntry}
				autoCorrect={autoCorrect}
				onChangeText={onChangeText}
				placeholderClassName="font-extrabold"
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
			testID="email-input"
			icon={<MaterialIcons name="email" size={24} color="#472836" />}
			placeholder="email"
			keyboardType="email-address"
		/>
	)
}

const PasswordInputField: FC<InputFieldProps> = (props) => {
	return (
		<InputField
			{...props}
			testID="password-input"
			icon={<MaterialIcons name="lock" size={24} color="#472836" />}
			placeholder="password"
			secureTextEntry
		/>
	)
}

const NameInputField: FC<InputFieldProps> = (props) => {
	return (
		<InputField
			{...props}
			testID="name-input"
			icon={
				<MaterialIcons
					name="account-circle"
					size={24}
					color="#472836"
				/>
			}
			placeholder="name"
			keyboardType="default"
		/>
	)
}

export default InputField
export { EmailInputField, NameInputField, PasswordInputField }
