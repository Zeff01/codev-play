import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import ChoiceButton from "./ChoiceButton";

export default function ChoiceSection() {
    return (
        <section className="flex gap-6">
            <ChoiceButton label="Rock" icon={<FaRegHandRock />} />
            <ChoiceButton label="Paper" icon={<FaRegHandPaper />} />
            <ChoiceButton label="Scissors" icon={<FaRegHandScissors />} />
        </section>
    );
}
